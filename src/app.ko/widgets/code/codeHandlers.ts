module Vienna.Widgets.Code {
    export class CodeHandlers extends MediaHandlers implements Editing.IWidgetable, Editing.IContentDropHandler {
        private static DefaultCodeUri = "https://raw.githubusercontent.com/daniellmb/once.js/master/once.js";
        private static DefaultThumbnailUri = "data:application/octet-stream;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGcgaWQ9ImNvZGUiIG9wYWNpdHk9IjAuNzUiPgoJPHBhdGggaWQ9ImxlZnQtYnJhY2tldCIgZD0iTTQsMTJ2LTFoMWMxLDAsMSwwLDEtMVY3LjYxNEM2LDcuMSw2LjAyNCw2LjcxOCw2LjA3Myw2LjQ3MkM2LjEyNyw2LjIyLDYuMjEyLDYuMDA5LDYuMzMsNS44MzkKCQlDNi41MzQsNS41Niw2LjgwMyw1LjM2NCw3LjEzOCw1LjI1NUM3LjQ3Myw1LjE0LDguMDEsNSw4Ljk3Myw1SDEwdjFIOS4yNDhjLTAuNDU3LDAtMC43NywwLjE5MS0wLjkzNiwwLjQwOAoJCUM4LjE0NSw2LjYyMyw4LDYuODUzLDgsNy40NzZ2MS44NTdjMCwwLjcyOS0wLjA0MSwxLjE4LTAuMjQ0LDEuNDkzYy0wLjIsMC4zMDctMC41NjIsMC41MjktMS4wOSwwLjY2NwoJCWMwLjUzNSwwLjE1NSwwLjksMC4zODUsMS4wOTYsMC42ODhDNy45NjEsMTIuNDg0LDgsMTIuOTM4LDgsMTMuNjY1djEuODYyYzAsMC42MTksMC4xNDUsMC44NDgsMC4zMTIsMS4wNjIKCQljMC4xNjYsMC4yMiwwLjQ3OSwwLjQwNywwLjkzNiwwLjQwN0wxMCwxN2wwLDB2MUg4Ljk3M2MtMC45NjMsMC0xLjUtMC4xMzMtMS44MzUtMC4yNDhjLTAuMzM1LTAuMTA5LTAuNjA0LTAuMzA3LTAuODA4LTAuNTkxCgkJYy0wLjExOC0wLjE2NS0wLjIwMy0wLjM3NC0wLjI1Ny0wLjYyNUM2LjAyNCwxNi4yODMsNiwxNS45LDYsMTUuMzg3VjEzYzAtMSwwLTEtMS0xSDR6Ii8+Cgk8dXNlIHRyYW5zZm9ybT0ibWF0cml4KC0xLDAsMCwxLDI0LDApIiBpZD0icmlnaHQtYnJhY2tldCIgeD0iMCIgeT0iMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiB4bGluazpocmVmPSIjbGVmdC1icmFja2V0IiAvPgo8L2c+Cjwvc3ZnPgo=";
        private static ThumbnailTimeOffset = 60;

        constructor() {
            super(["application/javascript", "text/plain", "text/html"], [".js", ".json", ".cs", ".java"]);
        }

        public getWidgetOrderByDefault(): Promise<Editing.IWidgetOrder> {
            var config: ICodeConfig = {
                lang: "javascript",
                code: 'function foo(items) {\r\n\tvar x = "Put your code snippet here";\r\n\treturn x;\r\n}',
                theme: "clouds"
            };

            return this.getWidgetOrder(config);
        }

        getWidgetOrder(config: ICodeConfig): Promise<Editing.IWidgetOrder>;
        getWidgetOrder(): Promise<Editing.IWidgetOrder>;
        getWidgetOrder(config?: ICodeConfig): Promise<Editing.IWidgetOrder> {
            if (!config || config.code) {
                var widgetOrder = this.createWidgetOrderByConfig(config);
                return Promise.resolve(widgetOrder);
            } else if (config.onload) {
                return config.onload.then(result => {
                    config.code = result;
                    return this.createWidgetOrderByConfig(config);
                });
            } else {
                throw new Error("Invalid argument config. Neither code nor onload defined.");
            }
        }

        createWidgetOrderByConfig(config?: Code.ICodeConfig): Editing.IWidgetOrder {
            var widgetOrder: Editing.IWidgetOrder = {
                title: "Code",
                factory: () => <Editing.IWidgetFactoryResult>{
                    element: Utils.createComponent("paper-codeblock", {
                        code: config ? config.code || "" : "function foo(items) {\r\n\tvar x = 'Put your code snippet here';\r\n\treturn x;\r\n}",
                        lang: config ? config.lang || this.getLangByFileName(config.filename) : "javascript",
                        theme: config ? config.theme : "clouds"
                    })
                },
            }
            return widgetOrder;
        }

        getLangByFileName(fileName: string): string {
            var extension = fileName.split('.').pop();
            switch (extension) {
                case "cs":
                    return "csharp";
                case "java":
                    return "java";
                case "c":
                case "h":
                    return "c_cpp";
                case "m":
                    return "objectivec";
                case "htm":
                case "html":
                    return "html";
                case "js":
                default:
                    return "javascript";
            }
        }

        protected getContentDescriptor(item: IMediaItem): Editing.IContentDescriptor {
            var descriptor: Editing.IContentDescriptor = {
                title: "Code",
                description: item.name,
                getWidgetOrder: () => {
                    var config: ICodeConfig = {
                        onload: this.readFileAsText(item.file),
                        filename: item.file.name,
                        theme: "clouds"
                    };
                    return this.getWidgetOrder(config);
                },
                thumbnailUrl: CodeHandlers.DefaultThumbnailUri,
                uploadables: [item.file ? item.file : item.url]
            };

            return descriptor;
        }

        public getContentDescriptorByMedia(item: Vienna.Data.IMedia): Editing.IContentDescriptor {
            return null;
        }

        private readFileAsText(file: File): ProgressPromise<string> {
            return new ProgressPromise((resolve, reject, progress) => {
                var reader = new FileReader();

                reader.onload = (event: any) => {
                    var text = event.target.result;
                    resolve(text);
                };

                reader.onprogress = (progressEvent: ProgressEvent) => {
                    if (progressEvent.lengthComputable) {
                        var percentLoaded = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        progress(percentLoaded);
                    }
                };

                reader.readAsText(file);
            });
        }

        title;
        description: string;
        layout: string;
    }
}