module Vienna.Widgets.Map {
    export const nodeName = "paper-googlemap";

    declare var GoogleMapsLoader;

    import IConfigProvider = Vienna.Configuration.IConfigProvider;

    export class MapHandlers implements Editing.IWidgetable, Editing.IContentDropHandler {
        private googleMapsKey: string;

        constructor(configProvider: IConfigProvider) {
            configProvider.getSetting().then((config) => {
                this.googleMapsKey = config.googlemaps.apiKey;

                GoogleMapsLoader.KEY = config.googlemaps.apiKey;
                GoogleMapsLoader.load();
            });
        }

        private getWidgetOrderByConfig(config: IMapConfig): Promise<Editing.IWidgetOrder> {
            var widgetOrder: Editing.IWidgetOrder = {
                title: "Map",
                factory: () => <Editing.IWidgetFactoryResult>{
                    element: Utils.createComponent(nodeName, {
                        location: config.location
                    })
                }
            }

            return Promise.resolve(widgetOrder);
        }

        private parseDataTransfer(dataTransfer: Editing.IDataTransfer): IMapConfig {
            var url = dataTransfer.getData("url");
            var isGoogleMapsLink = url != null && url.toLowerCase().startsWith("https://www.google.com/maps/");

            if (!isGoogleMapsLink) {
                return null;
            }

            var location: string;
            var match = new RegExp("/place/([^/]+)").exec(url);
            if (match && match.length > 1) {
                location = match[1].replaceAll("+", " ");
            } else {
                match = new RegExp("/@([^/]+)").exec(url);
                if (match && match.length > 1) {
                    var locationParts = match[1].split(",");
                    location = locationParts.slice(0, 2).join(",");
                }
            }

            return location ? <IMapConfig>{ location: location } : null;
        }

        public getWidgetOrder(): Promise<Editing.IWidgetOrder> {
            var config: IMapConfig = { location: "Seattle, WA" };

            return this.getWidgetOrderByConfig(config);
        }

        public getContentDescriptorByDataTransfer(dataTransfer: Editing.IDataTransfer): Editing.IContentDescriptor {
            var mapConfig = this.parseDataTransfer(dataTransfer);

            if (!mapConfig) {
                return null;
            }

            var descriptor: Editing.IContentDescriptor = {
                title: "Map",
                description: mapConfig.location,
                getWidgetOrder: () => this.getWidgetOrderByConfig(mapConfig),
                thumbnailUrl: "https://maps.googleapis.com/maps/api/staticmap?center={0}&format=jpg&size=130x90&key={1}".format(mapConfig.location, this.googleMapsKey)
            };

            return descriptor;
        }

        public getContentDescriptorByMedia(item: Vienna.Data.IMedia): Editing.IContentDescriptor {
            return null;
        }
    }
}