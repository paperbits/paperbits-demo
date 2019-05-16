/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import "./polyfills";
import * as ko from "knockout";
import { InversifyInjector } from "@paperbits/common/injection";
import { CoreDesignModule } from "@paperbits/core/core.design.module";
import { FormsDesignModule } from "@paperbits/forms/forms.design.module";
import { EmailsDesignModule } from "@paperbits/emails/emails.design.module";
import { StylingDesignModule } from "@paperbits/styles/styles.design.module";
import { ProseMirrorModule } from "@paperbits/prosemirror/prosemirror.module";
import { OfflineModule } from "@paperbits/common/persistence/offline.module";
import { DemoDesignModule } from "./components/demo.design.module";

/* Uncomment to enable Firebase module */
// import { FirebaseModule } from "@paperbits/firebase/firebase.module";

const injector = new InversifyInjector();
injector.bindModule(new CoreEditModule());
injector.bindModule(new FormsEditModule());
injector.bindModule(new EmailsDesignModule());
injector.bindModule(new StylingEditModule());
injector.bindModule(new ProseMirrorModule());
injector.bindModule(new DemoDesignModule());

/* Uncomment to enable Firebase module */
// injector.bindModule(new FirebaseModule());

injector.bindModule(new OfflineModule());
injector.resolve("autostart");

document.addEventListener("DOMContentLoaded", () => {
    setImmediate(() => ko.applyBindings(undefined, document.body));
});