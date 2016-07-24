module Vienna.Widgets.Domain.Engagement {
    import IIntercomService = Vienna.Domain.Engagement.IIntercomService;
    import ILead = Vienna.Domain.Engagement.ILead;
    import IConfigProvider = Vienna.Configuration.IConfigProvider;
    import formatFunction = moment.formatFunction;

    export class GoogleTagManager {
        static baseUrl = "//www.googletagmanager.com/ns.html?id=";
        static gtmDataLayerName = 'dataLayer';
        public gtmUrl:KnockoutObservable<string>;
        private abTestingService:Vienna.Widgets.Domain.Engagement.ABTestingService;

        constructor(window:Window, configProvider:IConfigProvider, abTestingService: ABTestingService) {
            window[GoogleTagManager.gtmDataLayerName] = window[GoogleTagManager.gtmDataLayerName] || [];
            this.abTestingService = abTestingService;
            this.boot = this.boot.bind(this);
            this.onConfigLoaded = this.onConfigLoaded.bind(this);
            abTestingService.init(2, "ABTesting");
            configProvider.getSetting().then(this.onConfigLoaded);
            this.gtmUrl = ko.observable<string>("sometring");
            this.gtmUrl("adasd");
        }

        private setGtmUrl (url: string): void {
            this.gtmUrl(url);
        }

        private onConfigLoaded(config:any) {
            this.boot(config.gtm.containerId);
        }

        private boot(containerId:string) {
            let gtmContainerUrl : string = GoogleTagManager.baseUrl + containerId;

            this.setGtmUrl(gtmContainerUrl);
            (function (window, document, scriptTag, dataLayer, containerId) {
                let gtmDataLayer : any = window[dataLayer];
                gtmDataLayer.push({
                    'gtm.start': new Date().getTime(), event: 'gtm.js'
                });
                let firstScriptElement = document.getElementsByTagName(scriptTag)[0],
                    gtmScriptElement : HTMLScriptElement = <HTMLScriptElement>document.createElement(scriptTag),
                    dl = dataLayer != 'dataLayer' ? '&l=' + dataLayer : '';
                gtmScriptElement["async"] = true;
                gtmScriptElement["src"] = '//www.googletagmanager.com/gtm.js?id=' + containerId + dl;
                firstScriptElement.parentNode.insertBefore(gtmScriptElement, firstScriptElement);
            })(window, document, 'script', GoogleTagManager.gtmDataLayerName, containerId);
        }
    }
}