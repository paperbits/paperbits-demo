/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */


import * as _ from "lodash";
import * as FileSaver from "file-saver";
import * as Objects from "@paperbits/common/objects";
import { HttpClient } from "@paperbits/common/http";
import { IObjectStorage, Query, Operator, OrderDirection, Page } from "@paperbits/common/persistence";

const pageSize = 20;

/**
 * Static object storage for demo purposes. It stores all the uploaded blobs in memory.
 */
export class StaticObjectStorage implements IObjectStorage {
    private loadDataPromise: Promise<Object>;
    protected storageDataObject: Object;
    private splitter = "/";

    constructor(private readonly httpClient: HttpClient) { }

    protected async getData(): Promise<Object> {
        if (this.loadDataPromise) {
            return this.loadDataPromise;
        }

        this.loadDataPromise = new Promise<Object>(async (resolve) => {
            const response = await this.httpClient.send({
                url: "/data/demo.json",
                method: "GET"
            });

            this.storageDataObject = response.toObject();

            resolve(this.storageDataObject);
        });

        return this.loadDataPromise;
    }

    public async addObject(path: string, dataObject: Object): Promise<void> {
        if (path) {
            const pathParts = path.split(this.splitter);
            const mainNode = pathParts[0];

            if (pathParts.length === 1 || (pathParts.length === 2 && !pathParts[1])) {
                this.storageDataObject[mainNode] = dataObject;
            }
            else {
                if (!_.has(this.storageDataObject, mainNode)) {
                    this.storageDataObject[mainNode] = {};
                }
                this.storageDataObject[mainNode][pathParts[1]] = dataObject;
            }
        }
        else {
            Object.keys(dataObject).forEach(prop => {
                const obj = dataObject[prop];
                const pathParts = prop.split(this.splitter);
                const mainNode = pathParts[0];

                if (pathParts.length === 1 || (pathParts.length === 2 && !pathParts[1])) {
                    this.storageDataObject[mainNode] = obj;
                }
                else {
                    if (!_.has(this.storageDataObject, mainNode)) {
                        this.storageDataObject[mainNode] = {};
                    }
                    this.storageDataObject[mainNode][pathParts[1]] = obj;
                }
            });
        }
    }

    public async getObject<T>(path: string): Promise<T> {
        const data = await this.getData();

        return Objects.getObjectAt(path, Objects.clone(data));
    }

    public async deleteObject(path: string): Promise<void> {
        if (!path) {
            return;
        }

        Objects.deleteNodeAt(path, this.storageDataObject);
    }

    public async updateObject<T>(path: string, dataObject: T): Promise<void> {
        if (!path) {
            return;
        }

        const clone: any = Objects.clone(dataObject);
        Objects.setValue(path, this.storageDataObject, clone);
        Objects.cleanupObject(clone); // Ensure all "undefined" are cleaned up
    }

    public async searchObjects<T>(path: string, query: Query<T>): Promise<Page<T>> {
        const data = await this.getData();

        if (!data) {
            return { value: [] };
        }

        const searchObj = Objects.getObjectAt(path, data);

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

        return new StaticPage(value, collection, pageSize);
    }

    public async saveChanges(delta: Object): Promise<void> {
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

        const state = JSON.stringify(this.storageDataObject);
        const stateBlob = new Blob([state], { type: "text/plain;charset=utf-8" });

        FileSaver.saveAs(stateBlob, "demo.json");

        /* Uncomment to save changes in a separate file */
        // const changes = JSON.stringify(delta);
        // const deltaBlob = new Blob([changes], { type: "text/plain;charset=utf-8" });
        // FileSaver.saveAs(deltaBlob, "changes.json");
    }

    public async loadData(): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            const input: HTMLInputElement = document.createElement("input");
            input.type = "file";

            input.onchange = e => {

                const target: HTMLInputElement = <HTMLInputElement>e.target;
                const file = target.files[0];

                if (!file) {
                    resolve(undefined);
                }

                const reader = new FileReader();
                reader.readAsText(file, "UTF-8");

                reader.onload = readerEvent => {
                    const contentString = readerEvent.target.result.toString();
                    const dataObject = contentString ? JSON.parse(contentString) : undefined;
                    this.storageDataObject = dataObject || this.storageDataObject;

                    this.loadDataPromise = new Promise<Object>(resolve => resolve(this.storageDataObject));

                    resolve(dataObject);
                };

            };

            input.click();
        });
    }
}

class StaticPage<T> implements Page<T> {
    constructor(
        public readonly value: T[],
        private readonly collection: any,
        private readonly skip: number,
    ) {
        if (skip > this.collection.length) {
            this.takeNext = null;
        }
    }

    public async takePrev?(): Promise<Page<T>> {
        throw new Error("Not implemented");
    }

    public async takeNext?(): Promise<Page<T>> {
        const value = this.collection.slice(this.skip, this.skip + pageSize);
        const skipNext = this.skip + pageSize;
        const nextPage = new StaticPage<T>(value, this.collection, skipNext);

        return nextPage;
    }
}