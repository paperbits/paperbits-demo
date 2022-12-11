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
     private dataObjectPromise: Promise<Object>;
 
     constructor(private readonly httpClient: HttpClient) { }
 
     private async loadData(): Promise<Object> {
         const response = await this.httpClient.send({
             url: "/data/demo.json",
             method: "GET"
         });
 
         this.dataObject = response.toObject();
 
         return this.dataObject;
     }
 
     public async getDataObject(): Promise<Object> {
         if (this.dataObjectPromise) {
             return this.dataObjectPromise;
         }
 
         this.dataObjectPromise = this.loadData();
 
         return this.dataObjectPromise;
     }
 
     public async setDataObject(dataObject: Object): Promise<void> {
         this.dataObject = dataObject;
     }
 }