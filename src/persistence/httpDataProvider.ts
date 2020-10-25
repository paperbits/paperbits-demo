/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { HttpClient } from "@paperbits/common/http";

export class HttpDataProvider {
    private initPromise: Promise<void>;
    private dataObject: Object;

    constructor(private readonly httpClient: HttpClient) { }

    private async initialize(): Promise<void> {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = new Promise<void>(async (resolve) => {
            const response = await this.httpClient.send({
                url: "/data/demo.json",
                method: "GET"
            });

            this.dataObject = response.toObject();

            resolve();
        });

        return this.initPromise;
    }

    public async getDataObject(): Promise<Object> {
        await this.initialize();

        return this.dataObject;
    }

    public async setDataObject(dataObject: Object): Promise<void> {
        this.dataObject = dataObject;
    }
}