module Vienna.Widgets {

    export class WidgetRegistrationService {
        private injector: IInjector;

        constructor(injector: IInjector) {
            this.injector = injector;
        }

        public registerWidget(name: string, config: IWidgetConfig) {
            if (typeof (config.viewModel) == "object") {
                var vmConfig = <IWidgetViewModelConfig>config.viewModel;
                if (vmConfig.factory) {
                    this.injector.bindFactory<any>(name, vmConfig.factory);
                } else if (vmConfig.component) {
                    this.injector.bindComponent<any>(name, vmConfig.factory);
                }
            } else {
                this.injector.bind(name, config.viewModel);
            }

            ko.components.register(name, {
                template: config.template,
                viewModel: { injectable: name },
                postprocess: (root: HTMLElement, viewModel: IWidgetModel) => {
                    if (root.parentNode.nodeType == 11) {
                        root = (<any>root.parentNode).host || root;
                    }

                    if (viewModel.getStateMap) {
                        var map = viewModel.getStateMap();
                        if (map) {
                            Object.keys(map).forEach(key => {
                                var attribute = root.attributes[key];
                                var value = <KnockoutObservable<any>>map[key];
                                value(attribute ? attribute.value : null);
                                value.subscribe(v => {
                                    if (v == null) {
                                        root.removeAttribute(key);
                                    } else {
                                        root.setAttribute(key, v);
                                    }
                                });
                            });
                        }
                    }

                    if (config.editor) {
                        var viewManager = this.injector.resolve<Ui.ViewManager>("viewManager");
                        var widgetEditor = this.injector.resolve<IWidgetEditor<any>>(config.editor);

                        root.addEventListener("dblclick", () => {
                            widgetEditor.setWidgetViewModel(viewModel);

                            viewManager.setWidgetEditor({ name: config.editor, params: viewModel });
                        });
                    }
                }
            });
        }

        public registerEditor(name: string, config: IEditorConfig) {
            this.injector.bindSingleton(name, config.viewModel);

            ko.components.register(name, {
                template: config.template,
                viewModel: { injectable: name }
            });
        }
    }

    export interface IWidgetConfig {
        template?: string | Node[] | DocumentFragment | KnockoutComponentTypes.TemplateElement | KnockoutComponentTypes.AMDModule | IRemoteTemplate;
        viewModel: IWidgetViewModelConfig | any;
        editor?: string;
    }

    export interface IEditorConfig {
        template: string | Node[] | DocumentFragment | KnockoutComponentTypes.TemplateElement | KnockoutComponentTypes.AMDModule | IRemoteTemplate;
        viewModel: IWidgetViewModelConfig| any;
    }

    export interface IRemoteTemplate {
        fromUrl: string;
    }

    export interface IWidgetViewModelConfig {
        factory?: (ctx: IInjector) => any;
        component?: (ctx: IInjector, params?: any) => any;
    }
}