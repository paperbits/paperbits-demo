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
export class StaticBlobStorage implements IBlobStorage {
    private storageDataObject = {};

    /**
     * Uploads specified content into browser memory and stores it as base64 string.
     * @param blobKey 
     * @param content 
     * @param contentType 
     */
    public async uploadBlob(blobKey: string, content: Uint8Array, contentType?: string): Promise<void> {
        this.storageDataObject[blobKey] = {
            contentType: contentType,
            content: content
        };
    }

    /**
     * Returns download URL of uploaded blob.
     * @param blobKey 
     */
    public async getDownloadUrl(blobKey: string): Promise<string> {
        const blobRecord = this.storageDataObject[blobKey];

        if (!blobRecord) {
            return null;
        }

        return `data:${blobRecord.contentType};base64,${Utils.arrayBufferToBase64(blobRecord.content)}`;
    }

    /**
     * Removes specified blob from memory.
     * @param blobKey 
     */
    public async deleteBlob(blobKey: string): Promise<void> {
        delete this.storageDataObject[blobKey];
    }

    public async downloadBlob?(blobKey: string): Promise<Uint8Array> {
        const blobRecord = this.storageDataObject[blobKey];

        if (blobRecord) {
            return blobRecord.content;
        }
        else {
            return null;
        }
    }
}

