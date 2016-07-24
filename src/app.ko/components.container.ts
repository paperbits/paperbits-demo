module Vienna {
    export function registerContainer(injector: IInjector) {

        /*** Core ***/
        injector.bindSingleton("httpClient", Vienna.Data.JQueryHttpClient);
        injector.bindSingleton("configProvider", Vienna.Configuration.ConfigProvider);
        injector.bindSingleton("eventManager", Vienna.DefaultEventManager);
        injector.bindSingleton("routeHandler", Vienna.DefaultRouteHandler);
        injector.bindSingleton("globalEventHandler", Vienna.GlobalEventHandler);
        injector.bindSingleton("localCache", Vienna.Data.LocalCache);
        injector.bindInstance("document", document);
        injector.bindInstance("window", window);
        injector.bindSingleton("abTestingService", Vienna.Widgets.Domain.Engagement.ABTestingService);
        injector.bindSingleton("analytics", Vienna.Widgets.Domain.Engagement.Analytics);
        injector.bindSingleton("gtm", Vienna.Widgets.Domain.Engagement.GoogleTagManager);

        /*** Services ***/
        injector.bindFactory<Vienna.IPermalinkService>("permalinkService", (ctx: Vienna.IInjector) => {
            var objectStorage = ctx.resolve<Vienna.Persistence.IObjectStorage>("objectStorage");
            return new Vienna.Data.PermalinkService(objectStorage);
        });
        injector.bindSingleton("widgetService", Vienna.Data.WidgetService);
        injector.bindSingleton("pagesService", Vienna.Data.PageService);
        injector.bindSingleton("mediaService", Vienna.Data.MediaService);
        injector.bindSingleton("navigationService", Vienna.Data.NavigationService);
        injector.bindSingleton("siteService", Vienna.Data.SiteService);


        injector.bindSingleton("staticStorage", Vienna.Data.StaticObjectStorage);

        /*** Firebase ***/
        injector.bindSingleton("firebaseManager", Vienna.Firebase.FirebaseManager);
        // injector.bindSingleton("fileStorage", Vienna.Firebase.FirebaseFileStorage);
        injector.bindSingleton("fileStorage", Vienna.Data.StaticFileStorage);
        injector.bindFactory<Vienna.Persistence.IObjectStorage>("objectStorage", (ctx: Vienna.IInjector) => {
            // var firebaseManager = ctx.resolve<Vienna.Firebase.FirebaseManager>("firebaseManager");
            // var objectStorage = new Vienna.Firebase.FirebaseObjectStorage(firebaseManager);
            // var eventManager = ctx.resolve<Vienna.IEventManager>("eventManager");
            //
            // return new Vienna.Data.CachedObjectStorage(objectStorage, eventManager);

            var httpClient = ctx.resolve<Vienna.Data.JQueryHttpClient>("httpClient");
            var abTestingService = ctx.resolve<Vienna.Widgets.Domain.Engagement.ABTestingService>("abTestingService");
            return new Vienna.Data.StaticObjectStorage(httpClient, abTestingService);
        });

        /*** Workshops ***/
        injector.bind("workshops", Workshops.Workshops);

        injector.bind("settingsWorkshop", Workshops.SettingsWorkshop);

        injector.bind("widgetsWorkshop", Workshops.WidgetsWorkshop);

        injector.bind("mediaWorkshop", Workshops.MediaWorkshop);

        injector.bind("pagesWorkshop", Workshops.PagesWorkshop);

        injector.bind("pageTemplatesWorkshop", Workshops.PageTemplatesWorkshop);

        injector.bind("navigationWorkshop", Workshops.NavigationWorkshop);

        injector.bindComponent("navigationDetailsWorkshop", (ctx, node) => {
            var navigationService = ctx.resolve<Vienna.Data.INavigationService>("navigationService");
            var viewManager = ctx.resolve<Vienna.Ui.ViewManager>("viewManager");

            return new Workshops.NavigationDetailsWorkshop(node, navigationService, viewManager);
        });

        injector.bindComponent("pageDetailsWorkshop", (ctx: IInjector, pageReference: Data.IPage) => {
            var pagesService = ctx.resolve<Data.IPageService>("pagesService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            var routeHandler = ctx.resolve<IRouteHandler>("routeHandler");
            var viewManager = ctx.resolve<Ui.ViewManager>("viewManager");

            return new Workshops.PageDetailsWorkshop(pagesService, permalinkService, routeHandler, pageReference, viewManager);
        });

        injector.bind("dropbucket", Workshops.DropBucket);

        /*** Handlers ***/
        injector.bindSingleton("mapDropHandler", Widgets.Map.MapHandlers);
        injector.bindSingleton("pictureDropHandler", Widgets.Picture.PictureHandlers);
        injector.bindSingleton("videoDropHandler", Widgets.Video.VideoHandlers);
        injector.bindSingleton("audioDropHandler", Widgets.Audio.AudioHandlers);
        injector.bindSingleton("youtubeDropHandler", Widgets.Youtube.YoutubeHandlers);
        injector.bindSingleton("codeDropHandler", Widgets.Code.CodeHandlers);

        injector.bindFactory<Array<Editing.IContentDropHandler>>("dropHandlers", (ctx: IInjector) => {
            var dropHandlers = new Array<Editing.IContentDropHandler>();

            dropHandlers.push(ctx.resolve<Widgets.Picture.PictureHandlers>("pictureDropHandler"));
            dropHandlers.push(ctx.resolve<Widgets.Map.MapHandlers>("mapDropHandler"));
            dropHandlers.push(ctx.resolve<Widgets.Video.VideoHandlers>("videoDropHandler"));
            dropHandlers.push(ctx.resolve<Widgets.Audio.AudioHandlers>("audioDropHandler"));
            dropHandlers.push(ctx.resolve<Widgets.Youtube.YoutubeHandlers>("youtubeDropHandler"));
            dropHandlers.push(ctx.resolve<Widgets.Code.CodeHandlers>("codeDropHandler"));

            return dropHandlers;
        });

        injector.bindFactory<Array<Editing.IWidgetable>>("widgetHandlers", (ctx: IInjector) => {
            var widgetHandlers = new Array<Editing.IWidgetable>();

            widgetHandlers.push(ctx.resolve<Widgets.Picture.PictureHandlers>("pictureDropHandler"));
            widgetHandlers.push(ctx.resolve<Widgets.Map.MapHandlers>("mapDropHandler"));
            widgetHandlers.push(ctx.resolve<Widgets.Video.VideoHandlers>("videoDropHandler"));
            widgetHandlers.push(ctx.resolve<Widgets.Audio.AudioHandlers>("audioDropHandler"));
            widgetHandlers.push(ctx.resolve<Widgets.Youtube.YoutubeHandlers>("youtubeDropHandler"));
            widgetHandlers.push(ctx.resolve<Widgets.Code.CodeHandlers>("codeDropHandler"));

            return widgetHandlers;
        });

        injector.bindComponent("pageSelector", (ctx: IInjector, onPageSelected: (permaLink: Data.IPermalink) => void) => {
            var pagesService = ctx.resolve<Data.IPageService>("pagesService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            return new Workshops.PageSelector(pagesService, permalinkService, onPageSelected);
        });

        injector.bindComponent("mediaSelector", (ctx: IInjector, onMediaSelected: (permaLink: Data.IPermalink) => void) => {
            var mediaService = ctx.resolve<Data.IMediaService>("mediaService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            return new Workshops.MediaSelector(mediaService, permalinkService, onMediaSelected);
        });

        /*** UI ***/
        injector.bindSingleton("viewManager", Ui.ViewManager);
        injector.bindSingleton("dragManager", Ui.DragManager);


        /*** Editors ***/
        injector.bindFactory("layoutEditor", (ctx) => {
            var eventManager = ctx.resolve<IEventManager>("eventManager");
            var viewManager = ctx.resolve<Ui.ViewManager>("viewManager");
            
            return new Vienna.Editing.LayoutEditor(eventManager, viewManager);
        });

        injector.bindSingleton("htmlEditor", Vienna.Editing.Aloha.AlohaHtmlEditor);
        injector.bindSingleton("codeEditor", Vienna.Widgets.Code.CodeEditor);
        injector.bindSingleton("textblockEditor", Vienna.Editing.TextblockEditor);
        injector.bindSingleton("formattingTools", Editing.FormattingTools);
        injector.bindSingleton("hyperlinkEditor", Editing.HyperlinkEditor);

        /*** Widgets ***/
        var widgetRegistrationService = new Widgets.WidgetRegistrationService(injector);

        injector.bind("pageWidget", Widgets.PageWidget);
        injector.bindSingleton("lightbox", Vienna.Ui.LityLightbox);

        injector.bindComponent("navbarWidget", (ctx: IInjector, config: any) => {
            var navigationService = ctx.resolve<Data.NavigationService>("navigationService");
            var permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            return new Widgets.Navbar.NavbarWidget(navigationService, permalinkService, config.navigationItem);
        });

        widgetRegistrationService.registerWidget("paper-layout", {
            template: Widgets.layoutWidgetTemplate,
            viewModel: Widgets.LayoutWidget
        });

        widgetRegistrationService.registerWidget(Widgets.Map.nodeName, {
            template: { fromUrl: "scripts/templates/widgets/map/map.html" },
            viewModel: Widgets.Map.Map,
            editor: "map-editor"
        });

        widgetRegistrationService.registerEditor("map-editor", {
            template: { fromUrl: "scripts/templates/widgets/map/mapEditor.html" },
            viewModel: Widgets.Map.MapEditor
        });

        widgetRegistrationService.registerWidget(Widgets.Picture.nodeName, {
            template: { fromUrl: "scripts/templates/widgets/picture/picture.html" },
            viewModel: Widgets.Picture.PictureViewModel,
            editor: "picture-editor"
        });

        widgetRegistrationService.registerEditor("picture-editor", {
            template: { fromUrl: "scripts/templates/widgets/picture/pictureEditor.html" },
            viewModel: Widgets.Picture.PictureEditor
        });

        widgetRegistrationService.registerWidget("paper-video", {
            template: { fromUrl: "scripts/templates/widgets/video/video.html" },
            viewModel: Widgets.Video.Video,
            editor: "video-editor"
        });
        widgetRegistrationService.registerEditor("video-editor", {
            template: { fromUrl: "scripts/templates/widgets/video/videoEditor.html" },
            viewModel: Widgets.Video.VideoEditor
        });

        widgetRegistrationService.registerWidget("paper-audio", {
            template: { fromUrl: "scripts/templates/widgets/audio/audio.html" },
            viewModel: Vienna.Widgets.Audio.Audio,
            editor: "audio-editor"
        });
        widgetRegistrationService.registerEditor("audio-editor", {
            template: { fromUrl: "scripts/templates/widgets/audio/audioEditor.html" },
            viewModel: Vienna.Widgets.Audio.AudioEditor,
        });

        widgetRegistrationService.registerWidget("paper-youtube", {
            template: { fromUrl: "scripts/templates/widgets/youtube/youtube.html" },
            viewModel: Vienna.Widgets.Youtube.Youtube
        });

        widgetRegistrationService.registerWidget("paper-codeblock", {
            template: { fromUrl: "scripts/templates/widgets/code/code.html" },
            viewModel: Vienna.Widgets.Code.Code,
            editor: "code-editor"
        });

        widgetRegistrationService.registerEditor("code-editor", {
            template: { fromUrl: "scripts/templates/widgets/code/codeEditor.html" },
            viewModel: Vienna.Widgets.Code.CodeEditor
        });

        /*** Intercom ***/
        injector.bindSingleton("intercomService", Vienna.Domain.Engagement.IntercomService);

        widgetRegistrationService.registerWidget("follow-us", {
            template: { fromUrl: "scripts/templates/widgets/domain/engagement/followUs.html" },
            viewModel: Vienna.Widgets.Domain.Engagement.FollowUs
        });

        injector.bindSingleton("contentBindingHandler", ContentBindingHandler);
        injector.bindSingleton("lighboxBindingHandler", LightboxBindingHandler);
        injector.bindSingleton("draggablesBindingHandler", DraggablesBindingHandler);

        injector.bind("tutorial", Vienna.Tutorial);
        injector.bind("tutorialScenario", Vienna.TutorialScenario);


        /*** Autostart ***/
        injector.resolve("globalEventHandler");
        injector.resolve("routeHandler");
        injector.resolve("formattingTools");
        injector.resolve("imageTools");
        injector.resolve("hyperlinkTools");
        injector.resolve("textblockEditor");
        injector.resolve("contentBindingHandler");
        injector.resolve("lighboxBindingHandler");
        injector.resolve("draggablesBindingHandler");
        injector.resolve("tutorialScenario");
    }
}