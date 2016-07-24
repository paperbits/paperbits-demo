module Vienna.Data {
    import IObjectStorage = Vienna.Persistence.IObjectStorage;
    import ABTestingService = Vienna.Widgets.Domain.Engagement.ABTestingService;
    export class StaticObjectStorage implements IObjectStorage {
        private httpClient: IHttpClient;
        private storageDataObject;
        private splitter = "/";

        constructor(httpClient: Vienna.Data.JQueryHttpClient, private abTestingService: ABTestingService) {
            this.httpClient = httpClient;
        }

        private getDataUrl(): string {
            var abValue = this.abTestingService.getValue();

            if (!abValue) {
                abValue = 1;
            }

            return "data/experiment{0}.json".format(abValue);
        }

        private getData(): Promise<any> {
            if (!this.storageDataObject) {
                return new Promise((resolve, reject) => {
                    this.httpClient.sendRequest({
                        url: this.getDataUrl(),
                        method: HttpMethod.get
                    }).then(data => {
                        this.storageDataObject = data;
                        resolve(this.storageDataObject);
                    }).catch(error => {
                        reject(error);
                    });
                });
            } else {
                return Promise.resolve(this.storageDataObject);
            }
        }

        private getPathObject(pathParts: string[]) {
            if (pathParts.length == 1 || (pathParts.length == 2 && !pathParts[1])) {
                return this.storageDataObject[pathParts[0]];
            } else {
                return this.storageDataObject[pathParts[0]][pathParts[1]];
            }
        }

        addObject(path: string, dataObject: any): Promise<void> {
            if (path) {
                let pathParts = path.split(this.splitter);
                let mainNode = pathParts[0];
                if (pathParts.length == 1 || (pathParts.length == 2 && !pathParts[1])) {
                    this.storageDataObject[mainNode] = dataObject;
                } else {
                    if (!_.has(this.storageDataObject, mainNode)) {
                        this.storageDataObject[mainNode] = {};
                    }
                    this.storageDataObject[mainNode][pathParts[1]] = dataObject;
                }
            }
            else {
                _.keys(dataObject).forEach(prop => {
                    let obj = dataObject[prop];
                    let pathParts = prop.split(this.splitter);
                    let mainNode = pathParts[0];
                    if (pathParts.length == 1 || (pathParts.length == 2 && !pathParts[1])) {
                        this.storageDataObject[mainNode] = obj;
                    } else {
                        if (!_.has(this.storageDataObject, mainNode)) {
                            this.storageDataObject[mainNode] = {};
                        }
                        this.storageDataObject[mainNode][pathParts[1]] = obj;
                    }
                });
            }

            return Promise.resolve<void>();
        }

        getObject<T>(path: string): Promise<T> {
            if (!path) {
                return Promise.resolve<T>();
            }

            let pathParts = path.split(this.splitter);
            let result: T = this.getPathObject(pathParts);

            return Promise.resolve<T>(result);
        }

        deleteObject(path: string): Promise<void> {
            if (path) {
                let pathParts = path.split(this.splitter);
                if (pathParts.length == 1 || (pathParts.length == 2 && !pathParts[1])) {
                    delete this.storageDataObject[pathParts[0]];
                } else {
                    delete this.storageDataObject[pathParts[0]][pathParts[1]];
                }
            }
            return Promise.resolve<void>();
        }

        updateObject<T>(path: string, dataObject: T): Promise<void> {
            if (path) {
                let pathParts = path.split(this.splitter);
                let updateObj: T = this.getPathObject(pathParts);
                _.extend(updateObj, dataObject);
            }

            return Promise.resolve<void>();
        }

        searchObjects<T>(path: string, propertyNames?: Array<string>, searchValue?: string, startAtSearch?: boolean, skipLoadObject?: boolean): Promise<Array<T>> {
            if (!path) {
                return Promise.resolve([]);
            }

            let result: Array<T> = [];
            let pathParts = path.split(this.splitter);

            return new Promise<Array<T>>((resolve, reject) => {
                this.getData().then((data) => {
                    if (!data) {
                        resolve(result);
                    }

                    let searchObj = this.getPathObject(pathParts);

                    let keys = _.keys(searchObj);

                    if (propertyNames && propertyNames.length && searchValue) {
                        let searchProps = propertyNames.map(name => {
                            let prop = {};
                            prop[name] = searchValue;
                            return prop;
                        });

                        keys.forEach(key => {
                            let matchedObj = searchObj[key];
                            let searchProperty = _.find(searchProps, (prop) => {
                                if (startAtSearch) {
                                    var propName = _.keys(prop)[0];
                                    let test = matchedObj[propName];
                                    return test && test.toUpperCase().startsWith(prop[propName].toUpperCase());
                                } else {
                                    return _.isMatch(matchedObj, prop);
                                }
                            });
                            if (searchProperty) {
                                result.push(matchedObj);
                            }
                        });
                    } else {
                        keys.forEach(key => {
                            let matchedObj = searchObj[key];
                            if (path === "navigationItems" && key === "navigationItems") {
                                result.push(matchedObj);
                            } else {
                                let searchId = matchedObj.key;
                                if (searchId && searchId.endsWith(key)) {
                                    result.push(matchedObj);
                                }
                            }
                        });
                    }

                    return resolve(result);
                }).catch(error => {
                    reject(error);
                });
            });
        }

    }
}
