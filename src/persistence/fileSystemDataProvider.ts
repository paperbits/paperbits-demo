/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import * as Utils from "../utils";

export class FileSystemDataProvider {
    private storageDataObject: Object;

    constructor(private readonly dataPath: string) { }

    protected async getDataObject(): Promise<Object> {
        if (!this.storageDataObject) {
            this.storageDataObject = JSON.parse(await Utils.loadFileAsString(this.dataPath));
        }
        return this.storageDataObject;
    }
}