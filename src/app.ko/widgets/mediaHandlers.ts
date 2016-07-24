module Vienna.Widgets {
    export abstract class MediaHandlers implements Editing.IContentDropHandler {
        private mediaTypePrefixes: string[];
        private fileExtensions: string[];

        constructor(mediaTypePrefixes: string[], fileExtensions: string[]) {
            this.mediaTypePrefixes = mediaTypePrefixes;
            this.fileExtensions = fileExtensions;
        }

        public getContentDescriptorByDataTransfer(dataTransfer: Editing.IDataTransfer): Editing.IContentDescriptor {
            var url = dataTransfer.getData("url");

            if (url) {
                var parser = document.createElement("a");
                parser.href = url.toLowerCase();

                if (parser.protocol == "data:") {
                    var mediaType = url.substring(5, url.indexOf(";"));
                    if (this.mediaTypePrefixes.any(m => mediaType.startsWith(m))) {
                        return this.getContentDescriptor({
                            name: "",
                            url: url
                        });
                    }
                }

                var path = parser.pathname.toLowerCase();
                var isVideo = url != null && this.fileExtensions.any(e => path.endsWith(e));

                if (isVideo) {
                    var parts = path.split('/');
                    var fileName = parts[parts.length - 1];
                    return this.getContentDescriptor({
                        name: fileName,
                        url: url
                    });
                }
            }

            for (var i = 0; i < dataTransfer.files.length; i++) {
                var file = dataTransfer.files[i];
                var fileType = file.type.toLowerCase();
                var fileName = file.name.toLowerCase();

                if (this.mediaTypePrefixes.any(m => fileType.startsWith(m) || this.fileExtensions.any(e => fileName.endsWith(e)))) {
                    return this.getContentDescriptor({
                        name: file.name,
                        file: file
                    });
                }
            }

            return null;
        }

        public getContentDescriptorByMedia(item: Vienna.Data.IMedia): Editing.IContentDescriptor {
            return null;
        }

        protected getContentDescriptor(item: IMediaItem): Editing.IContentDescriptor {
            return null;
        }

        protected toWidgetFactoryResult<TViewModel>(element: HTMLElement, onFileUploaded?: (viewModel: TViewModel, source: File | string, uploadedUrl: string) => void): Editing.IWidgetFactoryResult {
            var result: Editing.IWidgetFactoryResult = {
                element: element,
                mediaUploaded: (source: File | string, uploadedFileUrl: string) => {
                    var viewModel = <TViewModel>ko.dataFor(((<any>element).shadowRoot || element).children[0]);
                    onFileUploaded(viewModel, source, uploadedFileUrl);
                }
            };

            return result;
        }
    }
}