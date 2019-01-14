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
import { HttpClient } from "@paperbits/common/http";
import { IObjectStorage } from "@paperbits/common/persistence/IObjectStorage";


/**
 * Static object storage for demo purposes. It stores all the uploaded blobs in memory.
 */
export class StaticObjectStorage implements IObjectStorage {
    protected storageDataObject: Object;
    private splitter = "/";

    constructor(
        protected readonly datasourceUrl: string,
        private readonly httpClient: HttpClient
    ) { }

    protected async getData(): Promise<Object> {
        if (!this.storageDataObject) {
            const response = await this.httpClient.send({
                url: this.datasourceUrl,
                method: "GET"
            });

            const dataObject = response.toObject();

            this.storageDataObject = dataObject["tenants"]["default"];
        }

        return this.storageDataObject;
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

        return Utils.getObjectAt(path, data);
    }

    public async deleteObject(path: string): Promise<void> {
        if (!path) {
            return;
        }

        const pathParts = path.split(this.splitter);

        if (pathParts.length === 1 || (pathParts.length === 2 && !pathParts[1])) {
            delete this.storageDataObject[pathParts[0]];
        }
        else {
            delete this.storageDataObject[pathParts[0]][pathParts[1]];
        }
    }

    public async updateObject<T>(path: string, dataObject: T): Promise<void> {
        if (!path) {
            return;
        }
        const pathParts = path.split(this.splitter);
        const updateObj: T = this.getPathObject(pathParts);

        Object.assign(updateObj, dataObject);
    }

    public async searchObjects<T>(path: string, propertyNames?: string[], searchValue?: string, startAtSearch?: boolean, skipLoadObject?: boolean): Promise<T[]> {
        if (!path) {
            return [];
        }

        const result: any = {};
        const data = await this.getData();

        if (!data) {
            return result;
        }

        const searchObj = Utils.getObjectAt(path, data);
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
                    if (startAtSearch) {
                        const propName = _.keys(prop)[0];

                        const test = matchedObj[propName];
                        return test && test.toUpperCase().startsWith(prop[propName].toUpperCase());
                    }
                    else {
                        return _.isMatch(matchedObj, prop);
                    }
                });
                if (searchProperty) {
                    Utils.mergeDeepAt(`${path}/${key}`, result, matchedObj);
                }
            });
        }
        else {
            keys.forEach(key => {
                const matchedObj = searchObj[key];
                Utils.mergeDeepAt(`${path}/${key}`, result, matchedObj);
            });
        }
        return result;
    }

    public async saveChanges(delta: Object): Promise<void> {
        // const content = JSON.stringify(this.storageDataObject);
        // const blob = new Blob([content], { type: "text/plain;charset=utf-8" });

        // FileSaver.saveAs(blob, "demo.json");
    }
}