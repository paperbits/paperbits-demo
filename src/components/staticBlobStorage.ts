/**
 * @license
 * Copyright Vienna LLC. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://paperbits.io/license.
 */


import * as Utils from "@paperbits/common/utils";
import { IBlobStorage } from '@paperbits/common/persistence';
import { ProgressPromise } from '@paperbits/common';


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
    public async uploadBlob(blobKey: string, content: Uint8Array, contentType?: string): ProgressPromise<void> {
        return new ProgressPromise<void>((resolve, reject, progress) => {
            const base64String = Utils.arrayBufferToBase64(content);

            this.storageDataObject[blobKey] = `data:${contentType};base64,${base64String}`;

            resolve();
        });
    }

    /**
     * Returns download URL of uploaded blob.
     * @param blobKey 
     */
    public async getDownloadUrl(blobKey: string): Promise<string> {
        const downloadUrl = this.storageDataObject[blobKey];

        if (downloadUrl) {
            return downloadUrl;
        }
        else {
            throw `File ${blobKey} not found`;
        }
    }

    /**
     * Removes specified blob from memory.
     * @param blobKey 
     */
    public async deleteBlob(blobKey: string): Promise<void> {
        delete this.storageDataObject[blobKey];
    }
}

