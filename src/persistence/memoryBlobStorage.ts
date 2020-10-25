/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import * as Utils from "@paperbits/common/utils";
import { IBlobStorage } from "@paperbits/common/persistence";


/**
 * Static blob storage for demo purposes. It stores all the uploaded blobs in memory.
 */
export class MemoryBlobStorage implements IBlobStorage {
    private initPromise: Promise<Object>;

    constructor(private readonly dataProvider: any) { }

    protected async getDataObject(): Promise<Object> {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = new Promise<Object>(async (resolve) => {
            const dataObject = await this.dataProvider.getDataObject();
            const blobsDataObject = dataObject["blobs"] || {};
            dataObject["blobs"] = blobsDataObject;

            resolve(blobsDataObject);
        });

        return this.initPromise;
    }

    /**
     * Uploads specified content into browser memory and stores it as base64 string.
     * @param blobKey 
     * @param content 
     * @param contentType 
     */
    public async uploadBlob(blobKey: string, content: Uint8Array, contentType?: string): Promise<void> {
        const dataObject = await this.getDataObject();

        dataObject[blobKey] = {
            contentType: contentType,
            content: `data:${contentType};base64,${Utils.arrayBufferToBase64(content)}`
        };
    }

    /**
     * Returns download URL of uploaded blob.
     * @param blobKey 
     */
    public async getDownloadUrl(blobKey: string): Promise<string> {
        const dataObject = await this.getDataObject();
        const blobRecord = dataObject[blobKey];

        if (!blobRecord) {
            return null;
        }

        return blobRecord.content;
    }

    /**
     * Removes specified blob from memory.
     * @param blobKey 
     */
    public async deleteBlob(blobKey: string): Promise<void> {
        const dataObject = await this.getDataObject();
        delete dataObject[blobKey];
    }

    public async downloadBlob?(blobKey: string): Promise<Uint8Array> {
        const dataObject = await this.getDataObject();
        const blobRecord = dataObject[blobKey];

        if (blobRecord) {
            const base64 = blobRecord.content.replace("data:font/ttf;base64,", "");
            return Utils.base64ToArrayBuffer(base64);
        }
        else {
            return null;
        }
    }
}

