/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license.
 */


import * as Utils from "./utils";
import { ISettingsProvider } from "@paperbits/common/configuration/ISettingsProvider";


export class StaticSettingsProvider implements ISettingsProvider {
    private configuration: Object;

    constructor(private readonly settingsPath: string) { }

    public getSetting(name: string): Promise<Object> {
        return this.configuration[name];
    }

    public setSetting(name: string, value: Object): void {
        this.configuration[name] = value;
    }

    public async getSettings(): Promise<Object> {
        const settings = await Utils.loadFileAsString(this.settingsPath);
        this.configuration = JSON.parse(settings);

        return this.configuration;
    }
}