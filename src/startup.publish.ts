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

import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { ISiteSettings } from "@paperbits/common/sites/ISettings";

import { InversifyInjector } from "@paperbits/common/injection/inversifyInjector";
import { ISiteService } from "@paperbits/common/sites/ISiteService";
import { ISettingsProvider, Settings } from "@paperbits/common/configuration/ISettingsProvider";
import { IEventManager } from "@paperbits/common/events/IEventManager";
import { ComponentRegistrationCommon } from "@paperbits/knockout/registrations/components.common";
import { KnockoutRegistrationCommon } from "@paperbits/knockout/registrations/knockout.common";
import { KnockoutRegistrationWidgets } from "@paperbits/knockout/registrations/knockout.widgets";
import { KnockoutRegistrationLoaders } from "@paperbits/knockout/registrations/knockout.loaders";
import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";
import { IntentionsBuilder } from "@paperbits/common/appearance/intentionsBuilder";
import { IntentionsProvider } from "@paperbits/knockout/application/intentionsProvider";
import { IIntentionsBuilder } from "@paperbits/common/appearance/intention";
import { theme } from "@paperbits/knockout/application/theme";

import { PageViewModelBinder } from "@paperbits/knockout/widgets/page/pageViewModelBinder";
import { LayoutViewModelBinder } from "@paperbits/knockout/widgets/layout/layoutViewModelBinder";
import { RowViewModelBinder } from "@paperbits/knockout/widgets/row/rowViewModelBinder";
import { ColumnViewModelBinder } from "@paperbits/knockout/widgets/column/columnViewModelBinder";
import { SectionViewModelBinder } from "@paperbits/knockout/widgets/section/sectionViewModelBinder";
import { ButtonViewModelBinder } from "@paperbits/knockout/widgets/button/buttonViewModelBinder";
import { PictureViewModelBinder } from "@paperbits/knockout/widgets/picture/pictureViewModelBinder";
import { TextblockViewModelBinder } from "@paperbits/knockout/widgets/textblock/textblockViewModelBinder";
import { NavbarViewModelBinder } from "@paperbits/knockout/widgets/navbar/navbarViewModelBinder";
import { AudioPlayerViewModelBinder } from "@paperbits/knockout/widgets/audio-player/audioPlayerViewModelBinder";
import { YoutubePlayerViewModelBinder } from "@paperbits/knockout/widgets/youtube-player/youtubePlayerViewModelBinder";
import { VideoPlayerViewModelBinder } from "@paperbits/knockout/widgets/video-player/videoPlayerViewModelBinder";
import { MapViewModelBinder } from "@paperbits/knockout/widgets/map/mapViewModelBinder";
import { ViewModelBinderSelector } from "@paperbits/knockout/widgets/viewModelBinderSelector";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { SliderViewModelBinder } from "@paperbits/knockout/widgets/slider/sliderViewModelBinder";
import { IPublisher } from "@paperbits/publishing/publishers/IPublisher";
import { PublishingNodeModule } from "@paperbits/publishing/publishers/publishing.module";
import { FormModelBinder } from "@paperbits/common/widgets/form/formModelBinder";
import { FormViewModelBinder } from "@paperbits/knockout/widgets/form/formViewModelBinder";
import { SlateModule } from "@paperbits/slate/slate.module";
import { StaticLocalStorageModule } from "./storage/staticLocalStorage.module";
import { StaticSettingsProvider } from "./storage/staticSettingsProvider";
import { FileSystemBlobStorage } from "@paperbits/publishing/node/filesystemBlobStorage";
import { StaticRouteHandler } from "./storage/staticRouteHandler";

export class Publisher {
    constructor(private inputBasePath, private outputBasePath, private indexFilePath, private settingsConfigPath?) {
        this.inputBasePath = inputBasePath;
        this.outputBasePath = outputBasePath;
        this.indexFilePath = indexFilePath;
        this.settingsConfigPath = settingsConfigPath || `${this.inputBasePath}/config.json`;
    }

    public async publish(): Promise<void> {
        let html = await this.loadFileAsString(this.indexFilePath);
        
        const publishNodeModule = new PublishingNodeModule(html);
        publishNodeModule.initDocument();
        
        const injector = new InversifyInjector();
    
        const intentionsBuilder: IIntentionsBuilder = new IntentionsBuilder(theme);
        injector.bindInstance("intentionsProvider", new IntentionsProvider(intentionsBuilder));

        injector.bindModule(new SlateModule());
        injector.bindModule(new ComponentRegistrationCommon());        
        injector.bindModule(new KnockoutRegistrationCommon());
        injector.bindModule(new KnockoutRegistrationLoaders());
        injector.bindModule(new KnockoutRegistrationWidgets());
        
        const staticLocalStorage = new StaticLocalStorageModule("./src/data/demo.json");
        injector.bindModule(staticLocalStorage);        

        const configJson = await this.loadFileAsString(this.settingsConfigPath);
        const settings = JSON.parse(configJson);
        injector.bindInstance("settingsProvider", new StaticSettingsProvider(settings));
        injector.bindSingleton("routeHandler", StaticRouteHandler);
        
        injector.bindInstance("inputBlobStorage", new FileSystemBlobStorage(path.resolve(this.inputBasePath)));
        injector.bindInstance("outputBlobStorage", new FileSystemBlobStorage(path.resolve(this.outputBasePath)));
        publishNodeModule.registerComponents(injector);
    
        let modelBinders = new Array<IModelBinder>();
        injector.bindInstance("modelBinderSelector", new ModelBinderSelector(modelBinders));
        modelBinders.push(injector.resolve("navbarModelBinder"));
        modelBinders.push(injector.resolve("textModelBinder"));
        modelBinders.push(injector.resolve("pictureModelBinder"));
        modelBinders.push(injector.resolve("mapModelBinder"));
        modelBinders.push(injector.resolve("youtubeModelBinder"));
        modelBinders.push(injector.resolve("videoPlayerModelBinder"));
        modelBinders.push(injector.resolve("audioPlayerModelBinder"));
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
    
    
        let viewModelBinders = new Array<IViewModelBinder<any, any>>();
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
        injector.bind("audioPlayerViewModelBinder", AudioPlayerViewModelBinder);
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
        viewModelBinders.push(injector.resolve("audioPlayerViewModelBinder"));
        viewModelBinders.push(injector.resolve("youtubePlayerViewModelBinder"));
        viewModelBinders.push(injector.resolve("videoPlayerViewModelBinder"));
        viewModelBinders.push(injector.resolve("mapViewModelBinder"));
    
        injector.bind("formModelBinder", FormModelBinder);
        modelBinders.push(injector.resolve("formModelBinder"));
        injector.bind("formViewModelBinder", FormViewModelBinder);
        viewModelBinders.push(injector.resolve("formViewModelBinder"));
        
        publishNodeModule.register(injector);
        
        /*** Autostart ***/
        injector.resolve("widgetBindingHandler");
        injector.resolve("slateBindingHandler");
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

    private async loadFileAsString(filepath: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(filepath, "utf8", (error, content) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                resolve(content);
            });
        });
    }
}
