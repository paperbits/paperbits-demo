/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license.
 */


import * as _ from "lodash";
import * as FileSaver from "file-saver";
import * as Utils from "@paperbits/common/utils";
import * as Objects from "@paperbits/common/objects";
import { HttpClient } from "@paperbits/common/http";
import { IObjectStorage } from "@paperbits/common/persistence/IObjectStorage";

/**
 * Static object storage for demo purposes. It stores all the uploaded blobs in memory.
 */
export class StaticObjectStorage implements IObjectStorage {
    protected storageDataObject: Object;
    private splitter = "/";

    constructor(private readonly httpClient: HttpClient) { }

    protected async getData(): Promise<Object> {
        if (!this.storageDataObject) {
            const response = await this.httpClient.send({
                url: "/data/demo.json",
                method: "GET"
            });

            this.storageDataObject = response.toObject();
        }

        return new Promise<Object>((resolve) => {
            setImmediate(() => resolve(this.storageDataObject));
        });
    }

    private getPathObject(pathParts: string[]) {
        if (pathParts.length === 1 || (pathParts.length === 2 && !pathParts[1])) {
            return this.storageDataObject[pathParts[0]];
        } else {
            return this.storageDataObject[pathParts[0]][pathParts[1]];
        }
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

        return Objects.getObjectAt(path, data);
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

        Objects.setValueAt(path, this.storageDataObject, dataObject);        
    }

    public async searchObjects<T>(path: string, propertyNames?: string[], searchValue?: string): Promise<T> {
        const searchResultObject: any = {};
        const data = await this.getData();

        if (!data) {
            return searchResultObject;
        }

        const searchObj = Objects.getObjectAt(path, data);
        const keys = Object.keys(searchObj);

        if (propertyNames && propertyNames.length && searchValue) {
            const searchProps = propertyNames.map(name => {
                const prop = {};
                prop[name] = searchValue;
                return prop;
            });

            keys.forEach(key => {
                const matchedObj = searchObj[key];
                const searchProperty = _.find(searchProps, (prop) => {
                    const propName = _.keys(prop)[0];
                    const test = matchedObj[propName];
                    return test && test.toUpperCase() === prop[propName].toUpperCase();
                });

                if (searchProperty) {
                    Objects.mergeDeepAt(`${path}/${key}`, searchResultObject, matchedObj);
                }
            });
        }
        else {
            keys.forEach(key => {
                const matchedObj = searchObj[key];
                Objects.mergeDeepAt(`${path}/${key}`, searchResultObject, matchedObj);
            });
        }

        const resultObject = Objects.getObjectAt(path, searchResultObject);
        return <T>(resultObject || {});
    }

    public async saveChanges(delta: Object): Promise<void> {
        // const content = JSON.stringify(this.storageDataObject);
        // const blob = new Blob([content], { type: "text/plain;charset=utf-8" });

        // FileSaver.saveAs(blob, "demo.json");
    }
}