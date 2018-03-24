/**
 * @license
 * Copyright Vienna LLC. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://paperbits.io/license.
 */


import * as fs from "fs";
import { StaticObjectStorage } from "./staticObjectStorage";

export class StaticLocalObjectStorage extends StaticObjectStorage {
    constructor(datasourceUrl: string) {
        super(datasourceUrl, null);
    }

    protected async getData(): Promise<Object> {
        if (!this.storageDataObject) {
            const data = await this.loadFileAsString(this.datasourceUrl);
            this.storageDataObject = JSON.parse(data);
        }

        return this.storageDataObject;
    }

    private async loadFileAsString(filepath: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(filepath, "utf8", (error, content) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                resolve(content);
            });
        });
    }
}