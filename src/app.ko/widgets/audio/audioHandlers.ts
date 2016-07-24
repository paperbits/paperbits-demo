module Vienna.Widgets.Audio {
    import IFileStorage = Vienna.Persistence.IFileStorage;

    export class AudioHandlers extends MediaHandlers implements Editing.IWidgetable, Editing.IContentDropHandler {
        private fileStorage: IFileStorage;

        private static DefaultAudioUri = "http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v";
        private static DefaultThumbnailUri = "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%20standalone%3D%22no%22%3F%3E%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2270%22%20height%3D%2270%22%20version%3D%221.1%22%3E%3Crect%20width%3D%222%22%20height%3D%224%22%20x%3D%221%22%20y%3D%2233%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%226%22%20x%3D%224%22%20y%3D%2232%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%224%22%20x%3D%227%22%20y%3D%2233%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%222%22%20x%3D%2210%22%20y%3D%2234%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%228%22%20x%3D%2213%22%20y%3D%2231%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2228%22%20x%3D%2216%22%20y%3D%2221%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2240%22%20x%3D%2219%22%20y%3D%2215%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2230%22%20x%3D%2222%22%20y%3D%2220%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2262%22%20x%3D%2225%22%20y%3D%224%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2246%22%20x%3D%2228%22%20y%3D%2212%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2254%22%20x%3D%2231%22%20y%3D%228%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2238%22%20x%3D%2234%22%20y%3D%2216%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2214%22%20x%3D%2237%22%20y%3D%2228%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%226%22%20x%3D%2240%22%20y%3D%2232%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2228%22%20x%3D%2243%22%20y%3D%2221%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2236%22%20x%3D%2246%22%20y%3D%2217%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%2224%22%20x%3D%2249%22%20y%3D%2223%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%228%22%20x%3D%2252%22%20y%3D%2231%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%222%22%20x%3D%2255%22%20y%3D%2234%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%228%22%20x%3D%2258%22%20y%3D%2231%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%224%22%20x%3D%2261%22%20y%3D%2233%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%224%22%20x%3D%2264%22%20y%3D%2233%22%20%2F%3E%3Crect%20width%3D%222%22%20height%3D%222%22%20x%3D%2267%22%20y%3D%2234%22%20%2F%3E%3C%2Fsvg%3E%0A";
        private static ThumbnailTimeOffset = 60;

        constructor(fileStorage: IFileStorage) {
            super(["audio/webm", "video/webm", "audio/mp4", "audio/mp3", "video/mp4", "audio/ogg", "video/ogg", "application/ogg"], [".webm", ".mp4", ".m4a", ".mp3", ".m4p", ".m4b", ".m4r", ".m4v", ".ogg", ".oga", ".ogv", ".ogx", ".ogm"]);

            this.fileStorage = fileStorage;
        }

        protected getContentDescriptor(item: IMediaItem): Editing.IContentDescriptor {
            if (item.file) {
                item.url = URL.createObjectURL(item.file);
            }
            var descriptor: Editing.IContentDescriptor = {
                title: "Audio",
                description: item.name,
                getWidgetOrder: () => Promise.resolve(this.getWidgetOrderByUrl(item.url)),
                thumbnailUrl: AudioHandlers.DefaultThumbnailUri,
                uploadables: [item.file ? item.file : item.url]
            };

            return descriptor;
        }

        public getContentDescriptorByMedia(item: Vienna.Data.IMedia): Editing.IContentDescriptor {
            return null;
        }

        private getWidgetOrderByUrl(url: string): Editing.IWidgetOrder {
            return {
                title: "Audio",
                factory: () => this.toWidgetFactoryResult<Audio>(Utils.createComponent("paper-audio", {
                    src: url,
                    controls: true
                }), (viewModel, source, uploadedUrl) => viewModel.sourceUrl(uploadedUrl))
            }
        }

        public getWidgetOrder(): Promise<Editing.IWidgetOrder> {
            return Promise.resolve(this.getWidgetOrderByUrl(AudioHandlers.DefaultAudioUri));
        }
    }
}