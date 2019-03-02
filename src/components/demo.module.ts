

/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at style-guidehttps://paperbits.io/license/mit.
 */

import * as path from "path";
import { StaticBlobStorage } from "./staticBlobStorage";
import { StaticUserService } from "./staticUserService";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { StaticLocalObjectStorage } from "./staticLocalObjectStorage";
import { FileSystemBlobStorage } from "./filesystemBlobStorage";
import { StaticSettingsProvider } from "./staticSettingsProvider";
import { StaticRouteHandler } from "./staticRouteHandler";

export class DemoModule implements IInjectorModule {
    constructor(
        private readonly dataPath: string,
        private readonly settingsPath: string,
        private readonly outputBasePath: string
    ) { }

    public register(injector: IInjector): void {
        injector.bindSingleton("userService", StaticUserService);
        injector.bindSingleton("routeHandler", StaticRouteHandler);
        injector.bindSingleton("blobStorage", StaticBlobStorage);
        injector.bindInstance("objectStorage", new StaticLocalObjectStorage(path.resolve(this.dataPath)));
        injector.bindInstance("settingsProvider", new StaticSettingsProvider(path.resolve(this.settingsPath)));
        injector.bindInstance("outputBlobStorage", new FileSystemBlobStorage(path.resolve(this.outputBasePath)));
    }
}