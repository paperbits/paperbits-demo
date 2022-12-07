import * as _ from "lodash";
import * as Objects from "@paperbits/common/objects";
import { IObjectStorage, Query, Operator, OrderDirection, Page } from "@paperbits/common/persistence";
import { FirebaseService } from "../services/firebaseService";
import { FirebaseCollectionPage } from "./firebaseCollectionPage";
import { pageSize } from "./contants";


export class FirebaseObjectStorage implements IObjectStorage {
    constructor(private readonly firebaseService: FirebaseService) { }

    private normalizeDataObject<T>(dataObject: T): void {
        if (dataObject instanceof Object) {
            Object.keys(dataObject).forEach(key => {
                const child = dataObject[key];

                if (child instanceof Object) {
                    this.normalizeDataObject(child);
                }
                else if (child === undefined) {
                    dataObject[key] = null;
                }
            });
        }
    }

    public async addObject<T>(path: string, dataObject: T): Promise<void> {
        this.normalizeDataObject(dataObject);

        try {
            const databaseRef = await this.firebaseService.getDatabaseRef();

            if (path) {
                await databaseRef.child(path).set(dataObject);
            }
            else {
                await databaseRef.update(dataObject);
            }
        }
        catch (error) {
            throw new Error(`Could not add object '${path}'. ${error.stack || error.message}.`);
        }
    }

    public async getObject<T>(path: string): Promise<T> {
        try {
            const databaseRef = await this.firebaseService.getDatabaseRef();
            const snapshot = await databaseRef.child(path).once("value");

            return snapshot.val();
        }
        catch (error) {
            throw new Error(`Could not retrieve object '${path}'. ${error.stack || error.message}.`);
        }
    }

    public async deleteObject(path: string): Promise<void> {
        try {
            const databaseRef = await this.firebaseService.getDatabaseRef();
            databaseRef.child(path).remove();
        }
        catch (error) {
            throw new Error(`Could not delete object '${path}'. ${error.stack || error.message}.`);
        }
    }

    public async updateObject<T>(path: string, dataObject: T): Promise<void> {
        this.normalizeDataObject(dataObject);

        try {
            const databaseRef = await this.firebaseService.getDatabaseRef();
            return await databaseRef.child(path).update(dataObject);
        }
        catch (error) {
            throw new Error(`Could not update object '${path}'. ${error.stack || error.message}`);
        }
    }

    public async searchObjects<T>(path: string, query: Query<T>): Promise<Page<T>> {
        try {
            const databaseRef = await this.firebaseService.getDatabaseRef();
            const pathRef = databaseRef.child(path);
            const snapshot = await pathRef.once("value");
            const searchObj = snapshot.val();

            if (!searchObj) {
                return { value: [] };
            }

            let collection: any[] = Object.values(searchObj);

            if (query) {
                if (query.filters.length > 0) {
                    collection = collection.filter(x => {
                        let meetsCriteria = true;

                        for (const filter of query.filters) {
                            let left = Objects.getObjectAt<any>(filter.left, x);
                            let right = filter.right;

                            if (left === undefined) {
                                meetsCriteria = false;
                                continue;
                            }

                            if (typeof left === "string") {
                                left = left.toUpperCase();
                            }

                            if (typeof right === "string") {
                                right = right.toUpperCase();
                            }

                            const operator = filter.operator;

                            switch (operator) {
                                case Operator.contains:
                                    if (left && !left.includes(right)) {
                                        meetsCriteria = false;
                                    }
                                    break;

                                case Operator.equals:
                                    if (left !== right) {
                                        meetsCriteria = false;
                                    }
                                    break;

                                default:
                                    throw new Error("Cannot translate operator into Firebase Realtime Database query.");
                            }
                        }

                        return meetsCriteria;
                    });
                }

                if (query.orderingBy) {
                    const property = query.orderingBy;

                    collection = collection.sort((x, y) => {
                        const a = Objects.getObjectAt<any>(property, x);
                        const b = Objects.getObjectAt<any>(property, y);
                        const modifier = query.orderDirection === OrderDirection.accending ? 1 : -1;

                        if (a > b) {
                            return modifier;
                        }

                        if (a < b) {
                            return -modifier;
                        }

                        return 0;
                    });
                }
            }

            const value = collection.slice(0, pageSize);

            return new FirebaseCollectionPage(value, collection, pageSize);
        }
        catch (error) {
            throw new Error(`Could not search object '${path}'. ${error.stack || error.message}.`);
        }
    }

    public async saveChanges(delta: Object): Promise<void> {
        console.log("Saving changes...");

        const saveTasks = [];
        const keys = [];

        Object.keys(delta).map(key => {
            const firstLevelObject = delta[key];

            Object.keys(firstLevelObject).forEach(subkey => {
                keys.push(`${key}/${subkey}`);
            });
        });

        keys.forEach(key => {
            const changeObject = Objects.getObjectAt(key, delta);

            if (changeObject) {
                saveTasks.push(this.updateObject(key, changeObject));
            }
            else {
                saveTasks.push(this.deleteObject(key));
            }
        });

        await Promise.all(saveTasks);
    }
}

