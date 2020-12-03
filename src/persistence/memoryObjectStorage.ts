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
import { IObjectStorage, Query, Operator, OrderDirection, Page } from "@paperbits/common/persistence";

const pageSize = 20;


/**
 * Static object storage for demo purposes. It stores all the uploaded blobs in memory.
 */
export class MemoryObjectStorage implements IObjectStorage {
    private splitter = "/";

    constructor(private readonly dataProvider: any) { }

    protected async getDataObject(): Promise<Object> {
        const data = this.dataProvider.getDataObject();
        return data;
    }

    public async addObject(path: string, dataObject: Object): Promise<void> {
        const storageDataObject = await this.getDataObject();

        if (!path) {
            throw new Error(`Parameter "path" not specified.`);
        }

        if (path) {
            const pathParts = path.split(this.splitter);
            const mainNode = pathParts[0];

            if (pathParts.length === 1 || (pathParts.length === 2 && !pathParts[1])) {
                storageDataObject[mainNode] = dataObject;
            }
            else {
                if (!_.has(storageDataObject, mainNode)) {
                    storageDataObject[mainNode] = {};
                }
                storageDataObject[mainNode][pathParts[1]] = dataObject;
            }
        }
        else {
            Object.keys(dataObject).forEach(prop => {
                const obj = dataObject[prop];
                const pathParts = prop.split(this.splitter);
                const mainNode = pathParts[0];

                if (pathParts.length === 1 || (pathParts.length === 2 && !pathParts[1])) {
                    storageDataObject[mainNode] = obj;
                }
                else {
                    if (!_.has(storageDataObject, mainNode)) {
                        storageDataObject[mainNode] = {};
                    }
                    storageDataObject[mainNode][pathParts[1]] = obj;
                }
            });
        }
    }

    public async getObject<T>(path: string): Promise<T> {
        const data = await this.getDataObject();
        const node = Objects.getObjectAt<T>(path, data);

        if (!node) {
            return null;
        }

        return Objects.clone(node);
    }

    public async deleteObject(path: string): Promise<void> {
        if (!path) {
            return;
        }

        const storageDataObject = await this.getDataObject();
        Objects.deleteNodeAt(path, storageDataObject);
    }

    public async updateObject<T>(path: string, dataObject: T): Promise<void> {
        if (!path) {
            return;
        }

        const storageDataObject = await this.getDataObject();

        const clone: any = Objects.clone(dataObject);
        Objects.setValue(path, storageDataObject, clone);
        Objects.cleanupObject(clone); // Ensure all "undefined" are cleaned up
    }

    public async searchObjects<T>(path: string, query: Query<T>): Promise<Page<T>> {
        const storageDataObject: any = Objects.clone(await this.getDataObject());

        if (!storageDataObject) {
            return { value: [] };
        }

        const searchObj = Objects.getObjectAt(path, storageDataObject);

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

        const value = Objects.clone<T[]>(collection.slice(0, pageSize));

        return new StaticPage(value, collection, pageSize);
    }

    public async saveChanges(delta: Object): Promise<void> {
        console.log("Saving changes...");
        const storageDataObject = await this.getDataObject();

        Objects.mergeDeep(storageDataObject, delta, true);

        const state = JSON.stringify(storageDataObject);
        const stateBlob = new Blob([state], { type: "text/plain;charset=utf-8" });

        FileSaver.saveAs(stateBlob, "demo.json");
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

                reader.onload = async (readerEvent) => {
                    const contentString = readerEvent.target.result.toString();
                    const dataObject = contentString ? JSON.parse(contentString) : undefined;

                    await this.dataProvider.setDataObject(dataObject);

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