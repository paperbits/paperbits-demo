import "es6-shim";
import "setimmediate";
import "@paperbits/knockout/registrations/knockout.editors";

import * as $ from "jquery/dist/jquery";
import * as ko from "knockout";
import { IntercomService } from "@paperbits/common/intercom/intercomService";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { InversifyInjector } from "@paperbits/common/injection/inversifyInjector";
import { ComponentRegistrationCommon } from "@paperbits/knockout/registrations/components.common";
import { ComponentRegistrationEditors } from "@paperbits/knockout/registrations/components.editors";
import { KnockoutRegistrationCommon } from "@paperbits/knockout/registrations/knockout.common";
import { KnockoutRegistrationWidgets } from "@paperbits/knockout/registrations/knockout.widgets";
import { KnockoutRegistrationLoaders } from "@paperbits/knockout/registrations/knockout.loaders";
import { FirebaseModule } from "@paperbits/firebase/firebase.module";
import { GlobalEventHandler } from "@paperbits/common/events/globalEventHandler";
import { IEventManager } from "@paperbits/common/events/IEventManager";
import { SlateModule } from "@paperbits/slate/slate.module";
import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";

// import { intentions } from "./themes/hostmeapp/intentions";
// import { ThemeModule } from "./themes/hostmeapp/scripts/theme.module";
import { ThemeModule } from "./scripts/theme.module";
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

import { Substitute1ModelBinder } from "@paperbits/knockout/widgets/substitute1/substitute1ModelBinder";
import { Substitute1ViewModelBinder } from "@paperbits/knockout/widgets/substitute1/substitute1ViewModelBinder";
import { Substitute2ModelBinder } from "@paperbits/knockout/widgets/substitute2/substitute2ModelBinder";
import { Substitute2ViewModelBinder } from "@paperbits/knockout/widgets/substitute2/substitute2ViewModelBinder";
import { Substitute3ModelBinder } from "@paperbits/knockout/widgets/substitute3/substitute3ModelBinder";
import { Substitute3ViewModelBinder } from "@paperbits/knockout/widgets/substitute3/substitute3ViewModelBinder";
import { Substitute4ModelBinder } from "@paperbits/knockout/widgets/substitute4/substitute4ModelBinder";
import { Substitute4ViewModelBinder } from "@paperbits/knockout/widgets/substitute4/substitute4ViewModelBinder";
import { Substitute5ModelBinder } from "@paperbits/knockout/widgets/substitute5/substitute5ModelBinder";
import { Substitute5ViewModelBinder } from "@paperbits/knockout/widgets/substitute5/substitute5ViewModelBinder";
import { Substitute6ModelBinder } from "@paperbits/knockout/widgets/substitute6/substitute6ModelBinder";
import { Substitute6ViewModelBinder } from "@paperbits/knockout/widgets/substitute6/substitute6ViewModelBinder";
import { Substitute7ModelBinder } from "@paperbits/knockout/widgets/substitute7/substitute7ModelBinder";
import { Substitute7ViewModelBinder } from "@paperbits/knockout/widgets/substitute7/substitute7ViewModelBinder";
import { Substitute8ModelBinder } from "@paperbits/knockout/widgets/substitute8/substitute8ModelBinder";
import { Substitute8ViewModelBinder } from "@paperbits/knockout/widgets/substitute8/substitute8ViewModelBinder";
import { OfflineObjectStorage } from "@paperbits/common/persistence/offlineObjectStorage";
import { AnchorMiddleware } from "@paperbits/common/persistence/AnchorMiddleware";
import { IntentionsBuilder } from "@paperbits/common/appearence/intentionsBuilder";
import { IntentionsProvider } from "@paperbits/knockout/application/intentionsProvider";
import { IIntentionsBuilder } from "@paperbits/common/appearence/intention";


$(() => {
    var injector = new InversifyInjector();

    const intentionsBuilder: IIntentionsBuilder = new IntentionsBuilder(theme);
    injector.bindInstance("intentionsProvider", new IntentionsProvider(intentionsBuilder));

    injector.bindModule(new SlateModule());
    injector.bindModule(new ComponentRegistrationCommon());
    injector.bindModule(new ComponentRegistrationEditors());
    injector.bindModule(new KnockoutRegistrationLoaders());
    injector.bindModule(new KnockoutRegistrationCommon());
    injector.bindModule(new KnockoutRegistrationWidgets());
    injector.bindModule(new FirebaseModule());
    injector.bindModule(new ThemeModule());

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

    let viewModelBinders = new Array<IViewModelBinder>();
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


    injector.bind("substitute1ModelBinder", Substitute1ModelBinder);
    modelBinders.push(injector.resolve("substitute1ModelBinder"));
    injector.bind("substitute1ViewModelBinder", Substitute1ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute1ViewModelBinder"));

    injector.bind("substitute2ModelBinder", Substitute2ModelBinder);
    modelBinders.push(injector.resolve("substitute2ModelBinder"));
    injector.bind("substitute2ViewModelBinder", Substitute2ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute2ViewModelBinder"));

    injector.bind("substitute3ModelBinder", Substitute3ModelBinder);
    modelBinders.push(injector.resolve("substitute3ModelBinder"));
    injector.bind("substitute3ViewModelBinder", Substitute3ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute3ViewModelBinder"));

    injector.bind("substitute4ModelBinder", Substitute4ModelBinder);
    modelBinders.push(injector.resolve("substitute4ModelBinder"));
    injector.bind("substitute4ViewModelBinder", Substitute4ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute4ViewModelBinder"));

    injector.bind("substitute5ModelBinder", Substitute5ModelBinder);
    modelBinders.push(injector.resolve("substitute5ModelBinder"));
    injector.bind("substitute5ViewModelBinder", Substitute5ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute5ViewModelBinder"));

    injector.bind("substitute6ModelBinder", Substitute6ModelBinder);
    modelBinders.push(injector.resolve("substitute6ModelBinder"));
    injector.bind("substitute6ViewModelBinder", Substitute6ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute6ViewModelBinder"));

    injector.bind("substitute7ModelBinder", Substitute7ModelBinder);
    modelBinders.push(injector.resolve("substitute7ModelBinder"));
    injector.bind("substitute7ViewModelBinder", Substitute7ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute7ViewModelBinder"));

    injector.bind("substitute8ModelBinder", Substitute8ModelBinder);
    modelBinders.push(injector.resolve("substitute8ModelBinder"));
    injector.bind("substitute8ViewModelBinder", Substitute8ViewModelBinder);
    viewModelBinders.push(injector.resolve("substitute8ViewModelBinder"));


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

    ko.applyBindings();
});


