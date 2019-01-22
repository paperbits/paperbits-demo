/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license.
 */

import * as path from "path";
import * as ko from "knockout";
import * as Utils from "./components/utils";
import { createDocument } from "@paperbits/core/ko/knockout-rendring";
import { InversifyInjector } from "@paperbits/common/injection";
import { IPublisher } from "@paperbits/common/publishing";
import { PublishingNodeModule } from "./publishing";
import { StaticSettingsProvider } from "./components/staticSettingsProvider";
import { FileSystemBlobStorage } from "./components/filesystemBlobStorage";
import { StaticRouteHandler } from "./components/staticRouteHandler";
import { FormsModule } from "@paperbits/forms/forms.module";
import { EmailsModule } from "@paperbits/emails/emails.module";
import { CoreModule } from "@paperbits/core/core.module";
import { StyleModule } from "@paperbits/styles/styles.module";
import { ProseMirrorModule } from "@paperbits/prosemirror/prosemirror.module";
import { DemoModule } from "./components/demo.module";
// import { FirebaseModule } from "@paperbits/firebase/firebase.module";


const inputBasePath = "./dist/published/website";
const outputBasePath = "./dist/published";
const settingsPath = "./dist/config.publish.json";
const dataPath = "./dist/publisher/data/demo.json";

createDocument();

const injector = new InversifyInjector();
injector.bindModule(new CoreModule());
injector.bindModule(new FormsModule());
injector.bindModule(new EmailsModule());
injector.bindModule(new StyleModule());
injector.bindModule(new ProseMirrorModule());
injector.bindModule(new DemoModule(dataPath, settingsPath, inputBasePath, outputBasePath));
// injector.bindModule(new FirebaseModule());

injector.bindModule(new PublishingNodeModule());
injector.resolve("autostart");

ko.options["createChildContextWithAs"] = true;
ko.applyBindings();

const publisher = injector.resolve<IPublisher>("sitePublisher");

publisher.publish()
    .then(() => {
        console.log("DONE.");
        process.exit();
    })
    .catch((error) => {
        console.log(error);
        process.exit();
    });