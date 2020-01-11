/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import * as path from "path";
import { ConsoleLogger } from "@paperbits/common/logging";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { StaticBlobStorage } from "./staticBlobStorage";
import { StaticUserService } from "./staticUserService";
import { StaticLocalObjectStorage } from "./staticLocalObjectStorage";
import { FileSystemBlobStorage } from "./filesystemBlobStorage";
import { StaticSettingsProvider } from "./staticSettingsProvider";
import { StaticRouter } from "./staticRouter";
import { StaticRoleService } from "./staticRoleService";
import { SearchPublishModule } from "@paperbits/core/search/search.publish.module";
import { ClickCounterEditorModule } from "./click-counter/ko";


export class DemoPublishModule implements IInjectorModule {
    constructor(
        private readonly dataPath: string,
        private readonly settingsPath: string,
        private readonly outputBasePath: string
    ) { }

    public register(injector: IInjector): void {
        injector.bindSingleton("logger", ConsoleLogger);
        injector.bindSingleton("userService", StaticUserService);
        injector.bindSingleton("roleService", StaticRoleService);
        injector.bindSingleton("router", StaticRouter);
        injector.bindSingleton("blobStorage", StaticBlobStorage);
        injector.bindInstance("objectStorage", new StaticLocalObjectStorage(path.resolve(this.dataPath)));
        injector.bindInstance("settingsProvider", new StaticSettingsProvider(path.resolve(this.settingsPath)));
        injector.bindInstance("outputBlobStorage", new FileSystemBlobStorage(path.resolve(this.outputBasePath)));
        injector.bindModule(new SearchPublishModule());
        injector.bindModule(new ClickCounterEditorModule());
    }
}