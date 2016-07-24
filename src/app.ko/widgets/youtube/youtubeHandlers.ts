module Vienna.Widgets.Youtube {
    export class YoutubeHandlers implements Editing.IWidgetable, Editing.IContentDropHandler {
        private parseDataTransfer(dataTransfer: Editing.IDataTransfer): string {
            var url = dataTransfer.getData("url");
            var isYoutubeLink = url != null && url.toLowerCase().startsWith("https://www.youtube.com");

            if (!isYoutubeLink)
                return null;

            var videoId = new RegExp("[?&](?:v=)(.*?)(?:$|&)").exec(url);
            return videoId ? videoId[1] : null;
        }

        public getWidgetOrder(videoId?: string): Promise<Editing.IWidgetOrder> {
            if (!videoId) {
                videoId = "KK9bwTlAvgo";
            }

            var widgetOrder: Editing.IWidgetOrder = {
                title: "Youtube",
                factory: () => <Editing.IWidgetFactoryResult>{
                    element: Utils.createComponent("paper-youtube", {
                        videoId: videoId
                    })
                }
            }

            return Promise.resolve(widgetOrder);
        }

        public getContentDescriptorByDataTransfer(dataTransfer: Editing.IDataTransfer): Editing.IContentDescriptor {
            var videoId = this.parseDataTransfer(dataTransfer);

            if (!videoId) {
                return null;
            }

            var title = ko.observable("Youtube");
            //$.ajax({
            //    url: "http://youtube.com/get_video_info?video_id=" + videoId,
            //    success: (data: string) => {
            //        var titleMatch = new RegExp("[?&](?:title=)(.*?)(?:$|&)").exec(data);
            //        if (titleMatch.length >= 2) {
            //            var newTitle = decodeURI(titleMatch[1]).replaceAll("+", " ").replace(/[^%]%([\dA-F]+)/g, m => {
            //                return String.fromCharCode(parseInt(m, 16));
            //            });
            //            title(newTitle);
            //        }
            //    },
            //});

            var descriptor: Editing.IContentDescriptor = {
                title: title,
                description: "",
                getWidgetOrder: (): Promise<Editing.IWidgetOrder> => {
                    return this.getWidgetOrder(videoId);
                },
                previewUrl: "https://img.youtube.com/vi/{0}/0.jpg".format(videoId),
                thumbnailUrl: "https://img.youtube.com/vi/{0}/0.jpg".format(videoId)
            };

            return descriptor;
        }

        public getContentDescriptorByMedia(item: Vienna.Data.IMedia): Editing.IContentDescriptor {
            return null;
        }
    }
}