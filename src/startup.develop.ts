/**
 * @license
 * Copyright Vienna LLC. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://paperbits.io/license.
 */


import "es6-shim";
import "setimmediate";
import "@paperbits/knockout/registrations/knockout.editors";

import * as ko from "knockout";
import { IntercomService } from "@paperbits/common/intercom/intercomService";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { InversifyInjector } from "@paperbits/common/injection/inversifyInjector";
import { ComponentRegistrationCommon } from "@paperbits/knockout/registrations/components.common";
import { ComponentRegistrationEditors } from "@paperbits/knockout/registrations/components.editors";
import { KnockoutRegistrationCommon } from "@paperbits/knockout/registrations/knockout.common";
import { KnockoutRegistrationWidgets } from "@paperbits/knockout/registrations/knockout.widgets";
import { KnockoutRegistrationLoaders } from "@paperbits/knockout/registrations/knockout.loaders";
// import { FirebaseModule } from "@paperbits/firebase/firebase.module";
import { DemoModule } from "./components/demo.module";
import { GlobalEventHandler } from "@paperbits/common/events";
import { IEventManager } from "@paperbits/common/events";
import { SlateModule } from "@paperbits/slate/slate.module";
import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";
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
import { SliderViewModelBinder } from "@paperbits/knockout/widgets/slider/sliderViewModelBinder";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { ViewModelBinderSelector } from "@paperbits/knockout/widgets/viewModelBinderSelector";

import { FormModelBinder } from "@paperbits/common/widgets/form/formModelBinder";
import { FormViewModelBinder } from "@paperbits/knockout/widgets/form/formViewModelBinder";
import { TestimonialsModelBinder } from "@paperbits/knockout/widgets/testimonials/testimonialsModelBinder";
import { TestimonialsViewModelBinder } from "@paperbits/knockout/widgets/testimonials/testimonialsViewModelBinder";
import { ContentTableModelBinder } from "@paperbits/common/widgets/content-table/contentTableModelBinder";
import { ContentTableViewModelBinder } from "@paperbits/knockout/widgets/content-table/contentTableViewModelBinder";

import { OfflineObjectStorage } from "@paperbits/common/persistence/offlineObjectStorage";
import { AnchorMiddleware } from "@paperbits/common/persistence/AnchorMiddleware";
import { IntentionsBuilder } from "@paperbits/common/appearance/intentionsBuilder";
import { IntentionsProvider } from "@paperbits/knockout/application/intentionsProvider";
import { IIntentionsBuilder } from "@paperbits/common/appearance/intention";


document.addEventListener("DOMContentLoaded", () => {
    var injector = new InversifyInjector();

    const intentionsBuilder: IIntentionsBuilder = new IntentionsBuilder(theme);
    injector.bindInstance("intentionsProvider", new IntentionsProvider(intentionsBuilder));

    injector.bindModule(new SlateModule());
    injector.bindModule(new ComponentRegistrationCommon());
    injector.bindModule(new ComponentRegistrationEditors());
    injector.bindModule(new KnockoutRegistrationLoaders());
    injector.bindModule(new KnockoutRegistrationCommon());
    injector.bindModule(new KnockoutRegistrationWidgets());
    // injector.bindModule(new FirebaseModule());
    injector.bindModule(new DemoModule("/data/demo.json"));

    let modelBinders = new Array();
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
    //editors.push(ctx.resolve("codeblockModelBinder"));


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

    injector.bind("formModelBinder", FormModelBinder);
    modelBinders.push(injector.resolve("formModelBinder"));
    injector.bind("formViewModelBinder", FormViewModelBinder);
    viewModelBinders.push(injector.resolve("formViewModelBinder"));

    injector.bind("testimonialsModelBinder", TestimonialsModelBinder);
    modelBinders.push(injector.resolve("testimonialsModelBinder"));
    injector.bind("testimonialsViewModelBinder", TestimonialsViewModelBinder);
    viewModelBinders.push(injector.resolve("testimonialsViewModelBinder"));

    injector.bind("contentTableModelBinder", ContentTableModelBinder);
    modelBinders.push(injector.resolve("contentTableModelBinder"));
    injector.bind("contentTableViewModelBinder", ContentTableViewModelBinder);
    viewModelBinders.push(injector.resolve("contentTableViewModelBinder"));

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


    /*** Autostart ***/
    injector.resolve("contentBindingHandler");
    injector.resolve("gridBindingHandler");
    injector.resolve("lighboxBindingHandler");
    injector.resolve("draggablesBindingHandler");
    injector.resolve("widgetBindingHandler");
    injector.resolve("hostBindingHandler");
    injector.resolve("slateBindingHandler");
    injector.resolve("balloonBindingHandler");
    injector.resolve("backgroundBindingHandler");
    injector.resolve("resizableBindingHandler");
    injector.resolve("savingHandler");

    const offlineObjectStorage = injector.resolve<OfflineObjectStorage>("offlineObjectStorage");
    const anchorMiddleware = injector.resolve<AnchorMiddleware>("anchorMiddleware");

    offlineObjectStorage.registerMiddleware(anchorMiddleware);

    ko.options["createChildContextWithAs"] = true;
    ko.applyBindings();
});


