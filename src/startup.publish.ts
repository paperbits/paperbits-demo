/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license.
 */

import "./polyfills";
import "setimmediate";
import * as path from "path";
import * as ko from "knockout";
import * as Utils from "./utils";

import { InversifyInjector } from "@paperbits/common/injection";
import { IPublisher, PublishingNodeModule } from "@paperbits/publishing/publishers";
import { HtmlModule } from "@paperbits/html/html.module";
import { StaticSettingsProvider } from "./components/staticSettingsProvider";
import { FileSystemBlobStorage } from "@paperbits/publishing/persistence";
import { StaticRouteHandler } from "./components/staticRouteHandler";
import { FormsModule } from "@paperbits/forms/forms.module";
import { CoreModule } from "@paperbits/core/core.module";


// import { FirebaseModule } from "@paperbits/firebase/firebase.module";
import { StaticLocalStorageModule } from "./components/staticLocalStorage.module";

export class Publisher {
    constructor(
        private readonly inputBasePath: string,
        private readonly outputBasePath: string,
        private readonly indexFilePath: string,
        private readonly settingsConfigPath: string,
        private readonly demoDataPath: string
    ) {
    }

    public async publish(): Promise<void> {
        const html = await Utils.loadFileAsString(this.indexFilePath);

        const publishNodeModule = new PublishingNodeModule(html);
        publishNodeModule.initDocument();

        const injector = new InversifyInjector();

        injector.bindModule(new HtmlModule());

        // injector.bindModule(new FirebaseModule());
        injector.bindModule(new StaticLocalStorageModule(this.demoDataPath));

        injector.bindSingleton("routeHandler", StaticRouteHandler);
        const configJson = await Utils.loadFileAsString(this.settingsConfigPath);
        const settings = JSON.parse(configJson);
        injector.bindInstance("settingsProvider", new StaticSettingsProvider(settings));

        injector.bindModule(new CoreModule());
        injector.bindModule(new FormsModule());

        injector.bindInstance("inputBlobStorage", new FileSystemBlobStorage(path.resolve(this.inputBasePath)));
        injector.bindInstance("outputBlobStorage", new FileSystemBlobStorage(path.resolve(this.outputBasePath)));

        publishNodeModule.register(injector);

        /*** Autostart ***/
        injector.resolve("widgetBindingHandler");
        injector.resolve("htmlEditorBindingHandler");
        injector.resolve("backgroundBindingHandler");

        ko.options["createChildContextWithAs"] = true;
        ko.applyBindings();

        const publisher = injector.resolve<IPublisher>("sitePublisher");

        try {
            console.log(new Date());
            await publisher.publish();
            console.log(new Date());
        }
        catch (error) {
            console.log(error);
        }
    }
}
