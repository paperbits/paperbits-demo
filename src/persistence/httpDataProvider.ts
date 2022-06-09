/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { HttpClient } from "@paperbits/common/http";

export class HttpDataProvider {
    private dataObject: Object;

    constructor(private readonly httpClient: HttpClient) { }

    private async loadData(): Promise<Object> {
        const response = await this.httpClient.send({
            url: "/data/demo.json",
            method: "GET"
        });

        return response.toObject();
    }

    public async getDataObject(): Promise<Object> {
        if (this.dataObject) {
            return this.dataObject;
        }

        this.dataObject = this.loadData();

        return this.dataObject;
    }

    public async setDataObject(dataObject: Object): Promise<void> {
        this.dataObject = dataObject;
    }
}