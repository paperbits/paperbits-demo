module Vienna.Data {
    import IObjectStorage = Vienna.Persistence.IObjectStorage;

    const Action = "action";
    const ActionAdd = "add";
    const ActionUpdate = "update";

    export class CachedObjectStorage implements IObjectStorage {
        private localStorage: Storage;  //for changes
        private storage: IObjectStorage;      //for storage
        private lruCache: Cache.LruCache<any>; //lru cache for get objects
        private eventManager: IEventManager;
        private deletedObjects;
        public isOnline: boolean;

        constructor(storage: IObjectStorage, eventManager: IEventManager) {
            this.localStorage = window.localStorage;
            this.storage = storage;
            this.lruCache = new Cache.LruCache<any>(10000);
            this.eventManager = eventManager;

            this.saveChanges = this.saveChanges.bind(this);
            this.searchObjects = this.searchObjects.bind(this);
            this.onOnlineStatusChanged = this.onOnlineStatusChanged.bind(this);
            eventManager.addEventListener("onSaveChanges", this.saveChanges);

            this.isOnline = true;
            setTimeout(()=>{
                eventManager.addEventListener("onOnlineStatusChanged", this.onOnlineStatusChanged);
            }, 500);
        }

        private onOnlineStatusChanged(status){
            this.isOnline = status === "online";
            if(this.isOnline && this.deletedObjects) {
                let tasks = [];
                _.keys(this.deletedObjects).forEach(path => {
                    tasks.push(this.storage.deleteObject(path));
                });
                if(tasks.length) {
                    Promise.all(tasks).then(() => {
                        this.deletedObjects = undefined;
                    }, () => {
                        console.log("deleteObjects error after restore connection");
                    });
                }
            }
        }

        private getItemFromCache(path: string) {
            var changedItem = this.localStorage.getItem(path);

            if (changedItem) {
                return JSON.parse(changedItem);
            }

            var cachedItem = this.lruCache.getItem(path);
            if (cachedItem) {
                return cachedItem;
            }
        }

        public addObject(path: string, dataObject: any): Promise<void> {
            if (path) {
                dataObject[Action] = ActionAdd;
                this.localStorage.setItem(path, JSON.stringify(dataObject));
            }
            else {
                _.keys(dataObject).forEach(prop => {
                    let obj = dataObject[prop];
                    obj[Action] = ActionAdd;
                    this.localStorage.setItem(prop, JSON.stringify(obj));
                });
            }
            return Promise.resolve<void>();
        }

        public updateObject<T>(path: string, dataObject: T): Promise<T> {
            var cachedItem = this.getItemFromCache(path);

            if(cachedItem && _.isEqual(cachedItem, dataObject)) {
                return Promise.resolve<T>(dataObject);
            }

            if (cachedItem) {
                if (_.has(cachedItem, Action)) {
                    dataObject[Action] = cachedItem[Action];
                    dataObject = _.extend(cachedItem, dataObject);
                }
                else {
                    dataObject[Action] = ActionUpdate;
                }
            }
            else {
                dataObject[Action] = ActionUpdate;
            }

            this.localStorage.setItem(path, JSON.stringify(dataObject));
            this.lruCache.removeItem(path);

            return Promise.resolve<T>(dataObject);
        }

        public getObject<T>(path: string): Promise<T> {
            var cachedItem = this.getItemFromCache(path);
            if (cachedItem) {
                return Promise.resolve<T>(cachedItem);
            }

            if(!this.isOnline) {
                return Promise.reject("No internet connection");
            }

            var task = this.storage.getObject<T>(path);

            task.then(result => {
                this.lruCache.setItem(path, result);
            }, error => {
                throw new Error("getObject: " + error[0]);
            });

            return task;
        }

        public deleteObject(path: string): Promise<void> {
            var cachedItem = this.getItemFromCache(path);
            if (cachedItem && cachedItem[Action] === ActionAdd) {
                this.localStorage.removeItem(path);
                this.lruCache.removeItem(path);

                return Promise.resolve<void>();
            }

            if(!this.isOnline) {
                this.localStorage.removeItem(path);
                this.lruCache.removeItem(path);
                this.deletedObjects[path] = path;
                return Promise.resolve<void>();
            } else {
                let task = this.storage.deleteObject(path);

                task.then(() => {
                    this.localStorage.removeItem(path);
                    this.lruCache.removeItem(path);
                }, () => ["deleteObject error"]);

                return task;
            }
        }

        private getSearchId(item): string {
            if (_.has(item, "key")) {
                return item.key;
            }
            if (_.has(item, "contentId")) {
                return item.contentId;
            }
            if (_.has(item, "permalinkId")) {
                return item.permalinkId;
            }
            return undefined;
        }

        private convertToSearchParam(propertyNames:Array<string>, searchValue:string) {
            return propertyNames.map(name => {
                let prop = {};
                prop[name] = searchValue;
                return prop;
            });
        }

        private searchPropertyInObject(searchProps:{}[], startAtSearch:boolean, matchedObj:any) {
            return _.find(searchProps, (prop) => {
                if (startAtSearch) {
                    let propName = _.keys(prop)[0];
                    let test = matchedObj[propName];
                    return test && test.toUpperCase().startsWith(prop[propName].toUpperCase());
                } else {
                    return _.isMatch(matchedObj, prop);
                }
            });
        }

        private mergeResultWithCache<T>(result: Array<T>, path:string, propertyNames?: Array<string>, searchValue?: string, startAtSearch?: boolean): Array<T> {
            let resultIsNotEmpty = result && result.length;
            if (propertyNames && propertyNames.length && searchValue) {
                var searchProps = this.convertToSearchParam(propertyNames, searchValue);
                if(resultIsNotEmpty && startAtSearch){
                    let filteredResult =[];
                    result.forEach(item => {
                        var searchProperty = this.searchPropertyInObject(searchProps, true, item);
                        if (searchProperty) {
                            filteredResult.push(item);
                        }
                    });

                    result = filteredResult;
                }

                //items in local storage created or updated
                //merge search result from storage and from cached
                _.keys(this.localStorage).forEach(key => {
                    if (key.startsWith(path)) {
                        var matchedObj = JSON.parse(this.localStorage.getItem(key));
                        var searchProperty = this.searchPropertyInObject(searchProps, startAtSearch, matchedObj);
                        if (searchProperty) {
                            delete matchedObj[Action];

                            if (resultIsNotEmpty) {
                                let itemInResult = _.find(result, (item, index) => {
                                    let searchId = this.getSearchId(item);

                                    if (searchId && key.endsWith(searchId)) {
                                        result[index] = matchedObj;
                                        return true;
                                    }
                                });

                                if (!itemInResult) {
                                    result.push(matchedObj);
                                    this.lruCache.removeItem(key);
                                }
                            } else {
                                result.push(matchedObj);
                                this.lruCache.removeItem(key);
                            }
                        }
                    }
                });
            } else {
                //items in local storage created or updated
                //merge search result from storage and from cached
                _.keys(this.localStorage).forEach(key => {
                    if (key.startsWith(path)) {
                        var matchedObj = JSON.parse(this.localStorage.getItem(key));
                        delete matchedObj[Action];

                        if (resultIsNotEmpty) {
                            let itemInResult = _.find(result, (item, index) => {
                                let searchId = this.getSearchId(item);

                                if (searchId && key.endsWith(searchId)) {
                                    result[index] = matchedObj;
                                    return true;
                                }
                            });
                            if (!itemInResult) {
                                result.push(matchedObj);
                                this.lruCache.removeItem(key);
                            }
                        } else {
                            result.push(matchedObj);
                            this.lruCache.removeItem(key);
                        }
                    }
                });
            }
            return result;
        }

        public searchObjects<T>(path: string, propertyNames?: Array<string>, searchValue?: string, startAtSearch?: boolean, skipLoadObject?: boolean): Promise<Array<T>> {
            if(this.isOnline) {
                return this.storage.searchObjects<T>(path, propertyNames, searchValue, startAtSearch).then((result: Array<T>) => {
                    result.forEach(item => {
                        let id;
                        if(path === "navigationItems"){
                            id = path;
                        } else {
                            id = this.getSearchId(item);
                            if(path === "layouts"){
                                id = path + "/" + id;
                            }
                        }

                        this.lruCache.setItem(id, item);
                    });
                    return this.mergeResultWithCache<T>(result, path, propertyNames, searchValue, startAtSearch);
                });
            } else {

                // if offLine then search items in lruCache
                let result:Array<T> = [];
                let keys = this.lruCache.getKeys();

                if (propertyNames && propertyNames.length && searchValue) {
                    var searchProps = this.convertToSearchParam(propertyNames, searchValue);

                    keys.forEach(key => {
                        if (key.startsWith(path)) {
                            var matchedObj = this.lruCache.getItem(key);
                            var searchProperty = this.searchPropertyInObject(searchProps, startAtSearch, matchedObj);
                            if (searchProperty) {
                                result.push(matchedObj);
                            }
                        }
                    });
                } else {
                    keys.forEach(key => {
                        if (key.startsWith(path)) {
                            var matchedObj = this.lruCache.getItem(key);
                            if(path === "navigationItems" && key === "navigationItems"){
                                result.push(matchedObj);
                            } else {
                                let searchId = this.getSearchId(matchedObj);
                                if (searchId && key.endsWith(searchId)) {
                                    result.push(matchedObj);
                                }
                            }
                        }
                    });
                }

                return Promise.resolve<Array<T>>(this.mergeResultWithCache<T>(result, path, propertyNames, searchValue, startAtSearch))
            }
        }

        public saveChanges(): Promise<void> {
            if(!this.isOnline) {
                return Promise.reject("No internet connection");
            }
            var saveTasks = [];
            _.keys(this.localStorage).forEach(key =>{
                var objValue = this.localStorage.getItem(key);
                if(objValue) {
                    let obj = JSON.parse(objValue);
                    if(_.has(obj, Action)){
                        let isAddAction = obj[Action] === ActionAdd;
                        delete obj[Action];
                        if(isAddAction) {
                            saveTasks.push(this.storage.addObject(key, obj));
                        } else {
                            saveTasks.push(this.storage.updateObject(key, obj));
                        }
                        this.localStorage.removeItem(key);
                        this.lruCache.setItem(key, obj);
                    }
                }
            });

            if(saveTasks.length) {
                return new Promise<void>((resolve, reject) => {
                    Promise.all(saveTasks).then(() => {
                        resolve();
                    }, () => {
                        reject("saveChanges error");
                    });
                });
            } else {
                return Promise.resolve<void>();
            }

        }
    }
}
