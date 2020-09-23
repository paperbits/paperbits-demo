/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import * as fs from "fs";

export async function loadFileAsString(filepath: string): Promise<string> {
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