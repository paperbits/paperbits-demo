/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license.
 */

import "./polyfills";
import * as ko from "knockout";

import { InversifyInjector } from "@paperbits/common/injection";
import { OfflineObjectStorage, AnchorMiddleware } from "@paperbits/common/persistence";
import { CoreModule } from "@paperbits/core/core.module";
import { CoreEditModule } from "@paperbits/core/core.edit.module";
import { SettingsProvider } from "@paperbits/common/configuration";
import { DefaultRouteHandler } from "@paperbits/common/routing";
import { FormsModule } from "@paperbits/forms/forms.module";
import { FormsEditModule } from "@paperbits/forms/forms.edit.module";
import { EmailsModule } from "@paperbits/emails/emails.module";
import { EmailsEditModule } from "@paperbits/emails/emails.edit.module";
import { StylingEditModule } from "@paperbits/styles/styles.edit.module";
import { ProseMirrorModule } from "@paperbits/prosemirror/prosemirror.module";


// import { FirebaseModule } from "@paperbits/firebase/firebase.module";
import { DemoModule } from "./components/demo.module";

document.addEventListener("DOMContentLoaded", () => {
    const injector = new InversifyInjector();

    // injector.bindModule(new FirebaseModule());
    injector.bindModule(new DemoModule("/data/demo.json"));
    injector.bindSingleton("settingsProvider", SettingsProvider);
    injector.bindSingleton("routeHandler", DefaultRouteHandler);
    injector.bindModule(new CoreModule());
    injector.bindModule(new CoreEditModule());
    injector.bindModule(new FormsModule());
    injector.bindModule(new FormsEditModule());
    injector.bindModule(new EmailsModule());
    injector.bindModule(new EmailsEditModule());
    injector.bindModule(new StylingEditModule());
    injector.bindModule(new ProseMirrorModule());

    const offlineObjectStorage = injector.resolve<OfflineObjectStorage>("offlineObjectStorage");
    const anchorMiddleware = injector.resolve<AnchorMiddleware>("anchorMiddleware");
    offlineObjectStorage.registerMiddleware(anchorMiddleware);

    /*** Autostart ***/
    injector.resolve("contentBindingHandler");
    injector.resolve("gridBindingHandler");
    injector.resolve("lighboxBindingHandler");
    injector.resolve("draggablesBindingHandler");
    injector.resolve("widgetBindingHandler");
    injector.resolve("hostBindingHandler");
    injector.resolve("htmlEditorBindingHandler");
    injector.resolve("balloonBindingHandler");
    injector.resolve("backgroundBindingHandler");
    injector.resolve("resizableBindingHandler");
    injector.resolve("savingHandler");
    injector.resolve("errorHandler");
    injector.resolve("knockoutValidation");
    injector.resolve("inputBindingHandler");
    injector.resolve("cropperBindingHandler");
    injector.resolve("styleableBindingHandler");
    injector.resolve("stylesheetBindingHandler");

    ko.applyBindings(undefined, document.body);
});