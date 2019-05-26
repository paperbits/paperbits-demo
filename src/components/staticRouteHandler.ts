/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { IRouteHandler, Route } from "@paperbits/common/routing";

export class StaticRouteHandler implements IRouteHandler {
    private currentUrl: string;
    private metadata: Object;
    private callbacks: any[];

    constructor() {
        this.currentUrl = "/";
        this.navigateTo = this.navigateTo.bind(this);
        this.getCurrentUrl = this.getCurrentUrl.bind(this);
        this.getCurrentUrlMetadata = this.getCurrentUrlMetadata.bind(this);

        this.callbacks = [];
    }

    public addRouteChangeListener(callback: () => void): void {
        // this.callbacks.push(callback);
    }

    public removeRouteChangeListener(callback: () => void): void {
        // this.callbacks.spliceremove(callback);
    }

    public async navigateTo(url: string): Promise<void> {
        this.currentUrl = url;

        this.callbacks.forEach(callback => {
            callback();
        });
    }

    public getCurrentUrl(): string {
        return this.currentUrl;
    }

    public getPath(): string {
        return this.currentUrl;
    }

    public getHash(): string {
        return "";
    }

    public getCurrentUrlMetadata(): Object {
        return this.metadata;
    }

    public getCurrentRoute(): Route {
        return <any>{ path: this.currentUrl };
    }
}