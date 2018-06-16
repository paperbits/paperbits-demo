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
import { ComponentRegistrationCommon } from "@paperbits/knockout/registrations/components.common";
import { KnockoutRegistrationCommon } from "@paperbits/knockout/registrations/knockout.common";
import { KnockoutRegistrationWidgets } from "@paperbits/knockout/registrations/knockout.widgets";
import { KnockoutRegistrationLoaders } from "@paperbits/knockout/registrations/knockout.loaders";
import { IModelBinder } from "@paperbits/common/editing";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { RowViewModelBinder } from "@paperbits/knockout/widgets/row";
import { ColumnViewModelBinder } from "@paperbits/knockout/widgets/column";
import { SectionViewModelBinder } from "@paperbits/knockout/widgets/section";
import { TextblockViewModelBinder } from "@paperbits/knockout/widgets/textblock";
import { ViewModelBinderSelector } from "@paperbits/knockout/widgets";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { SliderViewModelBinder } from "@paperbits/knockout/widgets/slider";
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
        injector.bindModule(new ComponentRegistrationCommon());
        injector.bindModule(new KnockoutRegistrationCommon());
        injector.bindModule(new KnockoutRegistrationLoaders());
        injector.bindModule(new KnockoutRegistrationWidgets());

        // injector.bindModule(new FirebaseModule());
        injector.bindModule(new StaticLocalStorageModule("./src/data/demo.json"));

        const configJson = await Utils.loadFileAsString(this.settingsConfigPath);
        const settings = JSON.parse(configJson);
        injector.bindInstance("settingsProvider", new StaticSettingsProvider(settings));
        injector.bindSingleton("routeHandler", StaticRouteHandler);

        injector.bindInstance("inputBlobStorage", new FileSystemBlobStorage(path.resolve(this.inputBasePath)));
        injector.bindInstance("outputBlobStorage", new FileSystemBlobStorage(path.resolve(this.outputBasePath)));


        let modelBinders = new Array<IModelBinder>();
        injector.bindInstance("modelBinderSelector", new ModelBinderSelector(modelBinders));
        modelBinders.push(injector.resolve("textModelBinder"));
        modelBinders.push(injector.resolve("sectionModelBinder"));
        modelBinders.push(injector.resolve("sliderModelBinder"));

        injector.bind("htmlEditorFactory", () => {
            return {
                createHtmlEditor: () => {
                    return injector.resolve("htmlEditor");
                }
            }
        });

        let viewModelBinders = new Array<IViewModelBinder<any, any>>();
        injector.bindInstance("viewModelBinderSelector", new ViewModelBinderSelector(viewModelBinders));
        injector.bind("sectionViewModelBinder", SectionViewModelBinder);
        injector.bind("rowViewModelBinder", RowViewModelBinder);
        injector.bind("columnViewModelBinder", ColumnViewModelBinder);
        injector.bind("sliderViewModelBinder", SliderViewModelBinder);
        injector.bind("textblockViewModelBinder", TextblockViewModelBinder);

        viewModelBinders.push(injector.resolve("sectionViewModelBinder"));
        viewModelBinders.push(injector.resolve("sliderViewModelBinder"));
        viewModelBinders.push(injector.resolve("textblockViewModelBinder"));

        injector.bindModule(new CoreModule(modelBinders, viewModelBinders));
        injector.bindModule(new FormsModule(modelBinders, viewModelBinders));

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
