import * as fs from 'fs';
import { ISettingsProvider } from "@paperbits/common/configuration/ISettingsProvider";
import { IEventManager } from "@paperbits/common/events/IEventManager";


export class StaticSettingsProvider implements ISettingsProvider {
    private readonly configuration: Object;
    private loadingPromise: Promise<Object>;
    private configFilePath: string;

    constructor(config: Object) {
        const tenants = Object.keys(config);
        const tenantHostname = tenants[0];

        if (tenants.length > 1) {
            console.log(`Multiple tenants defined in config.json. Taking the first one "${tenantHostname}..."`);
        }

        this.configuration = config[tenantHostname];
    }

    public getSetting(name: string): Promise<Object> {
        return this.configuration[name];
    }

    public setSetting(name: string, value: Object): void {
        this.configuration[name] = value;
    }

    public async getSettings(): Promise<Object> {
        return this.configuration;
    }
}