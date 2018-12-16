/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license.
 */


import "setimmediate";
import * as path from "path";
import * as ko from "knockout";
import * as Utils from "./utils";
import { createDocument } from "@paperbits/core/ko/knockout-rendring";
import { InversifyInjector } from "@paperbits/common/injection";
import { IPublisher } from "@paperbits/common/publishing";
import { PublishingNodeModule } from "./publishing";
import { StaticSettingsProvider } from "./components/staticSettingsProvider";
import { FileSystemBlobStorage } from "./components/filesystemBlobStorage";
import { StaticRouteHandler } from "@paperbits/core/staticRouteHandler";
// import { FirebaseModule } from "@paperbits/firebase/firebase.module";
import { StaticLocalStorageModule } from "./components/staticLocalStorage.module";
import { FormsModule } from "@paperbits/forms/forms.module";
import { CoreModule } from "@paperbits/core/core.module";
import { EmailsModule } from "@paperbits/emails/emails.module";
import { EmailPublisher } from "@paperbits/emails/publishers/emailPublisher";
import { StyleModule } from "@paperbits/styles/styles.module";
import { ProseMirrorModule } from "@paperbits/prosemirror/prosemirror.module";

export class Publisher {
    constructor(
        private readonly inputBasePath,
        private readonly outputBasePath,
        private readonly pageTemplatePath,
        private readonly settingsConfigPath,
        private readonly demoDataPath
    ) { }

    public async publish(): Promise<void> {
        createDocument();

        const injector = new InversifyInjector();

        injector.bind("emailPublisher", EmailPublisher);

        const publishNodeModule = new PublishingNodeModule();
        injector.bindModule(new HtmlModule());

        // injector.bindModule(new FirebaseModule());
        injector.bindModule(new StaticLocalStorageModule(this.demoDataPath));

        injector.bindSingleton("routeHandler", StaticRouteHandler);
        const configJson = await Utils.loadFileAsString(this.settingsConfigPath);
        const settings = JSON.parse(configJson);

        const settingsProvider = new StaticSettingsProvider(settings);

        const pageTemplate = await Utils.loadFileAsString(this.pageTemplatePath);
        settingsProvider.setSetting("pageTemplate", pageTemplate);

        injector.bindInstance("settingsProvider", settingsProvider);

        injector.bindModule(new CoreModule());
        injector.bindModule(new FormsModule());
        injector.bindModule(new EmailsModule());
        injector.bindModule(new StyleModule());
        injector.bindModule(new ProseMirrorModule());

        injector.bindInstance("inputBlobStorage", new FileSystemBlobStorage(path.resolve(this.inputBasePath)));
        injector.bindInstance("outputBlobStorage", new FileSystemBlobStorage(path.resolve(this.outputBasePath)));

        publishNodeModule.register(injector);

        /*** Autostart ***/
        injector.resolve("widgetBindingHandler");
        injector.resolve("htmlEditorBindingHandler");
        injector.resolve("backgroundBindingHandler");
        injector.resolve("inputBindingHandler");

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
