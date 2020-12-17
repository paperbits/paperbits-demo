/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { InversifyInjector } from "@paperbits/common/injection";
import { IPublisher } from "@paperbits/common/publishing";
import { CacheStorageModule } from "@paperbits/common/publishing/cacheStorageModule";
import { FormsModule } from "@paperbits/forms/forms.module";
import { CoreModule } from "@paperbits/core/core.module";
import { CorePublishModule } from "@paperbits/core/core.publish.module";
import { EmailsModule } from "@paperbits/emails/emails.module";
import { EmailsPublishModule } from "@paperbits/emails/emails.publish.module";
import { StylePublishModule } from "@paperbits/styles/styles.publish.module";
import { ProseMirrorModule } from "@paperbits/prosemirror/prosemirror.module";
import { IntercomPublishModule } from "@paperbits/intercom/intercom.publish.module";
import { GoogleTagManagerPublishModule } from "@paperbits/gtm/gtm.publish.module";
import { DemoPublishModule } from "./modules/demo.publish.module";

/* Uncomment to enable Firebase module */
// import { FirebaseModule } from "@paperbits/firebase/firebase.admin.module";

/* Initializing dependency injection  */
const injector = new InversifyInjector();
injector.bindModule(new CoreModule());
injector.bindModule(new CorePublishModule());
injector.bindModule(new FormsModule());
injector.bindModule(new EmailsModule());
injector.bindModule(new EmailsPublishModule());
injector.bindModule(new StylePublishModule());
injector.bindModule(new ProseMirrorModule());
injector.bindModule(new IntercomPublishModule());
injector.bindModule(new GoogleTagManagerPublishModule());

/* Initializing Demo module */
const outputBasePath = "./dist/website";
const settingsPath = "./dist/publisher/config.json";
const dataPath = "./dist/publisher/data/demo.json";
injector.bindModule(new DemoPublishModule(dataPath, settingsPath, outputBasePath));

/* Uncomment to enable Firebase module */
// injector.bindModule(new FirebaseModule());

injector.bindModule(new CacheStorageModule());
injector.resolve("autostart");

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