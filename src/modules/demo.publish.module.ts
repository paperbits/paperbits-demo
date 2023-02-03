/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import * as path from "path";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { MemoryBlobStorage } from "../persistence/memoryBlobStorage";
import { StaticUserService } from "../user/staticUserService";
import { FileSystemObjectStorage } from "../persistence/fileSystemObjectStorage";
import { FileSystemBlobStorage } from "../persistence/fileSystemBlobStorage";
import { StaticSettingsProvider } from "../configuration/staticSettingsProvider";
import { StaticRouter } from "../routing/staticRouter";
import { StaticRoleService } from "../user/staticRoleService";
import { SearchPublishModule } from "@paperbits/core/search/search.publish.module";
import { ClickCounterDesignModule } from "../components/click-counter/clickCounter.design.module";
import { FileSystemDataProvider } from "../persistence/fileSystemDataProvider";
import { RoleBasedSecurityPublishModule } from "@paperbits/core/security/roleBasedSecurity.publish.module";
import { IntercomPublishModule } from "@paperbits/intercom/intercom.publish.module";
import { GoogleTagManagerPublishModule } from "@paperbits/gtm/gtm.publish.module";
import { ReactModule } from "@paperbits/react/react.module";


export class DemoPublishModule implements IInjectorModule {
    constructor(
        private readonly dataPath: string,
        private readonly settingsPath: string,
        private readonly outputBasePath: string
    ) { }

    public register(injector: IInjector): void {
        injector.bindSingleton("userService", StaticUserService);
        injector.bindSingleton("roleService", StaticRoleService);
        injector.bindSingleton("router", StaticRouter);
        injector.bindSingleton("blobStorage", MemoryBlobStorage);
        injector.bindInstance("dataProvider", new FileSystemDataProvider(path.resolve(this.dataPath)));
        injector.bindInstance("objectStorage", new FileSystemObjectStorage(path.resolve(this.dataPath)));
        injector.bindInstance("outputBlobStorage", new FileSystemBlobStorage(path.resolve(this.outputBasePath)));
        injector.bindInstance("settingsProvider", new StaticSettingsProvider(path.resolve(this.settingsPath)));
        injector.bindModule(new SearchPublishModule());
        injector.bindModule(new ClickCounterDesignModule());
        injector.bindModule(new IntercomPublishModule());
        injector.bindModule(new GoogleTagManagerPublishModule());
        injector.bindModule(new RoleBasedSecurityPublishModule());
        injector.bindModule(new ReactModule());
    }
}