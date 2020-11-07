/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import * as Utils from "../utils";
import * as Objects from "@paperbits/common/objects";
import { MemoryObjectStorage } from "./memoryObjectStorage";

export class FileSystemObjectStorage extends MemoryObjectStorage {
    private storageDataObject: Object;
    
    constructor(private readonly dataPath: string) {
        super(null);
    }

    protected async getDataObject(): Promise<Object> {
        if (!this.storageDataObject) {
            this.storageDataObject = JSON.parse(await Utils.loadFileAsString(this.dataPath));
            Objects.deepFreeze(this.storageDataObject);
        }
        
        return this.storageDataObject;
    }
}