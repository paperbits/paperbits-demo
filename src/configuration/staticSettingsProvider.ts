/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { ISettingsProvider } from "@paperbits/common/configuration";
import * as Utils from "../utils";

export class StaticSettingsProvider implements ISettingsProvider {
    private configuration: Object;
    private loadingPromise: Promise<void>;

    constructor(private readonly settingsPath: string) { }

    public async getSetting<T>(name: string): Promise<T> {
        await this.getSettings();
        return this.configuration[name];
    }

    public setSetting<T>(name: string, value: T): void {
        this.configuration[name] = value;
    }

    public getSettings<T>(): Promise<T> {
        if (!this.loadingPromise) {
            this.loadingPromise = this.loadSettings();
        }

        return <any>this.loadingPromise;
    }

    private async loadSettings(): Promise<any> {
        const configFileContent = await Utils.loadFileAsString(this.settingsPath);
        this.configuration = JSON.parse(configFileContent);
        return this.configuration;
    }
}