/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at style-guidehttps://paperbits.io/license/mit.
 */

import { InversifyInjector } from "@paperbits/common/injection";
import { IPublisher } from "@paperbits/common/publishing";
import { PublishingNodeModule } from "./publishing";
import { FormsModule } from "@paperbits/forms/forms.module";
import { CoreModule } from "@paperbits/core/core.module";
import { StyleModule } from "@paperbits/styles/styles.module";
import { ProseMirrorModule } from "@paperbits/prosemirror/prosemirror.module";
import { DemoModule } from "./components/demo.module";

/* Uncomment to enable Firebase module */
// import { FirebaseModule } from "@paperbits/firebase/firebase.admin.module";

/* Initializing dependency injection container */
const injector = new InversifyInjector();
injector.bindModule(new CoreModule());
injector.bindModule(new FormsModule());
injector.bindModule(new StyleModule());
injector.bindModule(new ProseMirrorModule());

/* Initializing Demo module */
const outputBasePath = "./dist/website";
const settingsPath = "./dist/publisher/config.json";
const dataPath = "./dist/publisher/data/demo.json";
injector.bindModule(new DemoModule(dataPath, settingsPath, outputBasePath));

/* Uncomment to enable Firebase module */
// injector.bindModule(new FirebaseModule());

injector.bindModule(new PublishingNodeModule());
injector.resolve("autostart");

/* Building dependency injection container */
const publisher = injector.resolve<IPublisher>("sitePublisher");

/* Running actual publishing */
publisher.publish()
    .then(() => {
        console.log("DONE.");
        process.exit();
    })
    .catch((error) => {
        console.log(error);
        process.exit();
    });