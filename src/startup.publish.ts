/**
 * @license
 * Copyright Vienna LLC. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://paperbits.io/license.
 */

import "es6-shim";
import "setimmediate";
import * as path from "path";
import * as ko from "knockout";
import * as Utils from "./utils";

import { InversifyInjector } from "@paperbits/common/injection";
import { IPublisher } from "@paperbits/publishing/publishers";
import { PublishingNodeModule } from "@paperbits/publishing/publishers";
import { HtmlModule } from "@paperbits/html/html.module";
import { StaticSettingsProvider } from "./components/staticSettingsProvider";
import { FileSystemBlobStorage } from "@paperbits/publishing/persistence";
import { StaticRouteHandler } from "./components/staticRouteHandler";
//import { FirebaseModule } from "@paperbits/firebase/firebase.module";
import { StaticLocalStorageModule } from "./components/staticLocalStorage.module";
import { FormsModule } from "@paperbits/forms/forms.module";
import { CoreModule } from "@paperbits/core/core.module";

export class Publisher {
    constructor(private inputBasePath, private outputBasePath, private indexFilePath, private settingsConfigPath) {
        this.inputBasePath = inputBasePath;
        this.outputBasePath = outputBasePath;
        this.indexFilePath = indexFilePath;
        this.settingsConfigPath = settingsConfigPath;
    }

    public async publish(): Promise<void> {
        let html = await Utils.loadFileAsString(this.indexFilePath);

        const publishNodeModule = new PublishingNodeModule(html);
        publishNodeModule.initDocument();

        const injector = new InversifyInjector();

        injector.bindModule(new HtmlModule());

        // injector.bindModule(new FirebaseModule());
        injector.bindModule(new StaticLocalStorageModule("./src/data/demo.json"));

        const configJson = await Utils.loadFileAsString(this.settingsConfigPath);
        const settings = JSON.parse(configJson);
        injector.bindInstance("settingsProvider", new StaticSettingsProvider(settings));
        injector.bindSingleton("routeHandler", StaticRouteHandler);

        const coreModule = new CoreModule();
        injector.bindModule(coreModule);
        injector.bindModule(new FormsModule(coreModule.modelBinders, coreModule.viewModelBinders));

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
