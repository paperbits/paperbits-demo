/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license.
 */

import * as ko from "knockout";
import { InversifyInjector } from "@paperbits/common/injection";
import { IPublisher } from "@paperbits/common/publishing";
import { PublishingNodeModule } from "./publishing";
import { FormsModule } from "@paperbits/forms/forms.module";
import { EmailsModule } from "@paperbits/emails/emails.module";
import { CoreModule } from "@paperbits/core/core.module";
import { StyleModule } from "@paperbits/styles/styles.module";
import { ProseMirrorModule } from "@paperbits/prosemirror/prosemirror.module";
import { DemoModule } from "./components/demo.module";
// import { FirebaseModule } from "@paperbits/firebase/firebase.admin.module";

const outputBasePath = "./dist/website";
const settingsPath = "./dist/publisher/config.json";
const dataPath = "./dist/publisher/data/demo.json";

const injector = new InversifyInjector();
injector.bindModule(new CoreModule());
injector.bindModule(new FormsModule());
injector.bindModule(new EmailsModule());
injector.bindModule(new StyleModule());
injector.bindModule(new ProseMirrorModule());
injector.bindModule(new DemoModule(dataPath, settingsPath, outputBasePath));
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