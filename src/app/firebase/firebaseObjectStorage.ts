module Vienna.Firebase {
    import IPermalink = Vienna.Data.IPermalink;
    import IFileReference = Vienna.Persistence.IFileReference;
    import FirebaseManager = Vienna.Firebase.FirebaseManager;

    export class FirebaseObjectStorage implements Vienna.Persistence.IObjectStorage {
        private firebaseManager: FirebaseManager;

        constructor(firebaseManager: FirebaseManager) {
            this.firebaseManager = firebaseManager;
        }

        public addObject(path: string, dataObject: any): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                this.firebaseManager.getDatabaseRef().then((databaseRef) => {
                    if (path) {
                        databaseRef.child(path).set(dataObject, (error) => {
                            if (error) {
                                console.log("Operation addObject: error {0}.".format(error));
                                reject(["Operation addObject: error {0}.".format(error)]);
                            } else {
                                console.log("Operation addObject: object added successfully.");
                                resolve();
                            }
                        });
                    }
                    else {
                        databaseRef.update(dataObject, (error) => {
                            if (error) {
                                console.log("Operation addObject: error {0}.".format(error));
                                reject(["Operation addObject: error {0}.".format(error)]);
                            } else {
                                console.log("Operation addObject: object added successfully.");
                                resolve();
                            }
                        });
                    }
                });
            });
        }

        public getObject<T>(path: string): Promise<T> {
            return new Promise<T>((resolve, reject) => {
                this.firebaseManager.getDatabaseRef().then((databaseRef) => {
                    databaseRef.child(path).once("value",
                        (snapshot) => {
                            resolve(snapshot.val());
                        }, (error) => {
                            console.log("Object {0} on get error {1}.".format(path, error));
                            reject(["Object {0} on get error {1}.".format(path, error)]);
                        });
                });
            });
        }

        public deleteObject(path: string): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                this.firebaseManager.getDatabaseRef().then((databaseRef) => {
                    databaseRef.child(path).remove((error: string) => {
                        if (error) {
                            console.log("Object '{0}' delete error {1} .".format(path, error));
                            reject(["file '{0}' delete error {1} .".format(path, error)]);
                        } else {
                            console.log("Object '{0}' deleted successfully.".format(path));
                            resolve();
                        }
                    });
                });
            });
        }

        public updateObject<T>(path: string, dataObject: T): Promise<T> {
            return new Promise<T>((resolve, reject) => {
                this.firebaseManager.getDatabaseRef().then((databaseRef) => {
                    databaseRef.child(path).update(dataObject,
                        error => {
                            if (error) {
                                console.log("Object update could not be completed. " + error);
                                reject(["Object update could not be completed. Error: " + error]);
                            } else {
                                console.log("Object update completed successfully.");
                                resolve(dataObject);
                            }
                        });
                });
            });
        }

        public searchObjects<T>(path: string, propertyNames?: Array<string>, searchValue?: string, startAtSearch?: boolean, skipLoadObject?: boolean): Promise<Array<T>> {
            return new Promise<Array<T>>((resolve, reject) => {
                this.firebaseManager.getDatabaseRef().then((databaseRef) => {
                    if (propertyNames && propertyNames.length && searchValue) {
                        var searchTasks = propertyNames.map((propertyName) => {
                            let query: FirebaseQuery = startAtSearch
                                ? databaseRef.child(path).orderByChild(propertyName).startAt(searchValue)
                                : databaseRef.child(path).orderByChild(propertyName).equalTo(searchValue);

                            return query.once("value").then((result) => this.collectResult(result));
                        });

                        Promise.all(searchTasks).then(
                            (searchTaskResults) => {
                                resolve(_.flatten(searchTaskResults));
                            },
                            (error) => {
                                console.log("Object {0} on search error {1}.".format(path, error));
                                return ["Object {0} on search error {1}.".format(path, error)];
                            });
                    }
                    else {
                        //return all objects

                        databaseRef.child(path).once("value",
                            (objectData) => {
                                let result = this.collectResult(objectData);
                                resolve(result);
                            },
                            (error) => {
                                console.log("Object {0} on search error {1}.".format(path, error));
                                reject(["Object {0} on search error {1}.".format(path, error)]);
                            }
                        );
                    }
                });
            });
        }

        private collectResult(objectData) {
            let result = [];
            if (objectData.hasChildren()) {
                let items = objectData.val();
                if (items) {
                    if (_.isArray(items)) {
                        items.map((item) => result.push(item));
                    } else {
                        _.mapObject(items, (item) => {
                            result.push(item)
                        });
                    }
                }
            }
            return result;
        };
    }
}