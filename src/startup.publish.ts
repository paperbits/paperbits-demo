/**
 * @license
 * Copyright Vienna LLC. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://paperbits.io/license.
 */


import "setimmediate";
import * as fs from "fs";
import * as path from "path";
import * as ko from "knockout";
import * as Utils from "./utils";
import { IInjector, IInjectorModule, InversifyInjector } from "@paperbits/common/injection";
import { ISiteSettings, ISiteService } from "@paperbits/common/sites";
import { ISettingsProvider, Settings } from "@paperbits/common/configuration";
import { IEventManager } from "@paperbits/common/events";
import { ComponentRegistrationCommon, KnockoutRegistrationCommon, KnockoutRegistrationWidgets, KnockoutRegistrationLoaders } from "@paperbits/knockout/registrations";
import { IModelBinder } from "@paperbits/common/editing";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { theme } from "@paperbits/knockout/application/theme";
import { PageViewModelBinder } from "@paperbits/knockout/widgets/page";
import { LayoutViewModelBinder } from "@paperbits/knockout/widgets/layout";
import { RowViewModelBinder } from "@paperbits/knockout/widgets/row";
import { ColumnViewModelBinder } from "@paperbits/knockout/widgets/column";
import { SectionViewModelBinder } from "@paperbits/knockout/widgets/section";
import { ButtonViewModelBinder } from "@paperbits/knockout/widgets/button";
import { PictureViewModelBinder } from "@paperbits/knockout/widgets/picture";
import { TextblockViewModelBinder } from "@paperbits/knockout/widgets/textblock";
import { NavbarViewModelBinder } from "@paperbits/knockout/widgets/navbar";
import { YoutubePlayerViewModelBinder } from "@paperbits/knockout/widgets/youtube-player";
import { VideoPlayerViewModelBinder } from "@paperbits/knockout/widgets/video-player";
import { MapViewModelBinder } from "@paperbits/knockout/widgets/map";
import { ViewModelBinderSelector } from "@paperbits/knockout/widgets";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { SliderViewModelBinder } from "@paperbits/knockout/widgets/slider";
import { IPublisher } from "@paperbits/publishing/publishers";
import { PublishingNodeModule } from "@paperbits/publishing/publishers";
import { TableOfContentsModelBinder } from "@paperbits/common/widgets/table-of-contents";
import { TableOfContentsViewModelBinder } from "@paperbits/knockout/widgets/table-of-contents";
import { HtmlModule } from "@paperbits/html/html.module";
import { StaticSettingsProvider } from "./components/staticSettingsProvider";
import { FileSystemBlobStorage } from "@paperbits/publishing/persistence";
import { StaticRouteHandler } from "./components/staticRouteHandler";

//import { FirebaseModule } from "@paperbits/firebase/firebase.module";
import { StaticLocalStorageModule } from "./components/staticLocalStorage.module";
import { FormsModule } from "@paperbits/forms/forms.module";

export class Publisher {
    constructor(private inputBasePath, private outputBasePath, private indexFilePath, private settingsConfigPath?) {
        this.inputBasePath = inputBasePath;
        this.outputBasePath = outputBasePath;
        this.indexFilePath = indexFilePath;
        this.settingsConfigPath = settingsConfigPath || `${this.inputBasePath}/config.json`;
    }

    public async publish(): Promise<void> {
        const html = await Utils.loadFileAsString(this.indexFilePath);

        const publishNodeModule = new PublishingNodeModule(html);
        publishNodeModule.initDocument();

        const injector = new InversifyInjector();

        const intentionsBuilder: IIntentionsBuilder = new IntentionsBuilder(theme);
        injector.bindInstance("intentionsProvider", new IntentionsProvider(intentionsBuilder));

        injector.bindModule(new HtmlModule());
        injector.bindModule(new ComponentRegistrationCommon());
        injector.bindModule(new KnockoutRegistrationCommon());
        injector.bindModule(new KnockoutRegistrationLoaders());
        injector.bindModule(new KnockoutRegistrationWidgets());

        //injector.bindModule(new FirebaseModule());
        injector.bindModule(new StaticLocalStorageModule("./src/data/demo.json"));

        const configJson = await Utils.loadFileAsString(this.settingsConfigPath);
        const settings = JSON.parse(configJson);
        injector.bindInstance("settingsProvider", new StaticSettingsProvider(settings));
        injector.bindSingleton("routeHandler", StaticRouteHandler);

        injector.bindInstance("inputBlobStorage", new FileSystemBlobStorage(path.resolve(this.inputBasePath)));
        injector.bindInstance("outputBlobStorage", new FileSystemBlobStorage(path.resolve(this.outputBasePath)));

        const modelBinders = new Array<IModelBinder>();
        injector.bindInstance("modelBinderSelector", new ModelBinderSelector(modelBinders));
        modelBinders.push(injector.resolve("navbarModelBinder"));
        modelBinders.push(injector.resolve("textModelBinder"));
        modelBinders.push(injector.resolve("pictureModelBinder"));
        modelBinders.push(injector.resolve("mapModelBinder"));
        modelBinders.push(injector.resolve("youtubeModelBinder"));
        modelBinders.push(injector.resolve("videoPlayerModelBinder"));
        modelBinders.push(injector.resolve("buttonModelBinder"));
        modelBinders.push(injector.resolve("sectionModelBinder"));
        modelBinders.push(injector.resolve("pageModelBinder"));
        modelBinders.push(injector.resolve("blogModelBinder"));
        modelBinders.push(injector.resolve("sliderModelBinder"));


        injector.bind("htmlEditorFactory", () => {
            return {
                createHtmlEditor: () => {
                    return injector.resolve("htmlEditor");
                }
            }
        })


        const viewModelBinders = new Array<IViewModelBinder<any, any>>();
        injector.bindInstance("viewModelBinderSelector", new ViewModelBinderSelector(viewModelBinders));
        injector.bind("pageViewModelBinder", PageViewModelBinder);
        injector.bind("layoutViewModelBinder", LayoutViewModelBinder);
        injector.bind("sectionViewModelBinder", SectionViewModelBinder);
        injector.bind("rowViewModelBinder", RowViewModelBinder);
        injector.bind("columnViewModelBinder", ColumnViewModelBinder);
        injector.bind("sliderViewModelBinder", SliderViewModelBinder);
        injector.bind("buttonViewModelBinder", ButtonViewModelBinder);
        injector.bind("pictureViewModelBinder", PictureViewModelBinder);
        injector.bind("textblockViewModelBinder", TextblockViewModelBinder);
        injector.bind("navbarViewModelBinder", NavbarViewModelBinder);
        injector.bind("youtubePlayerViewModelBinder", YoutubePlayerViewModelBinder);
        injector.bind("videoPlayerViewModelBinder", VideoPlayerViewModelBinder);
        injector.bind("mapViewModelBinder", MapViewModelBinder);

        viewModelBinders.push(injector.resolve("pageViewModelBinder"));
        viewModelBinders.push(injector.resolve("sectionViewModelBinder"));
        viewModelBinders.push(injector.resolve("sliderViewModelBinder"));
        viewModelBinders.push(injector.resolve("buttonViewModelBinder"));
        viewModelBinders.push(injector.resolve("pictureViewModelBinder"));
        viewModelBinders.push(injector.resolve("textblockViewModelBinder"));
        viewModelBinders.push(injector.resolve("navbarViewModelBinder"));
        viewModelBinders.push(injector.resolve("youtubePlayerViewModelBinder"));
        viewModelBinders.push(injector.resolve("videoPlayerViewModelBinder"));
        viewModelBinders.push(injector.resolve("mapViewModelBinder"));

        injector.bind("tableOfContentsModelBinder", TableOfContentsModelBinder);
        modelBinders.push(injector.resolve("tableOfContentsModelBinder"));
        injector.bind("tableOfContentsViewModelBinder", TableOfContentsViewModelBinder);
        viewModelBinders.push(injector.resolve("tableOfContentsViewModelBinder"));

        publishNodeModule.register(injector);

        injector.bindModule(new FormsModule(modelBinders, viewModelBinders));  

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
