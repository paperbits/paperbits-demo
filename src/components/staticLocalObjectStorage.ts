/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license.
 */


import * as fs from "fs";
import * as Utils from "../utils";
import { StaticObjectStorage } from "./staticObjectStorage";

export class StaticLocalObjectStorage extends StaticObjectStorage {
    constructor(datasourceUrl: string) {
        super(datasourceUrl, null);
    }

    protected async getData(): Promise<Object> {
        if (!this.storageDataObject) {
            const data = await Utils.loadFileAsString(this.datasourceUrl);
            const dataObject = JSON.parse(data);
            this.storageDataObject = dataObject["tenants"]["default"];
        }

        return this.storageDataObject;
    }
}