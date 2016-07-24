module Vienna {
    export function registerComponents(injector: IInjector) {
        ko.components.register("toolbox", {
            template: { fromUrl: "scripts/templates/widgets/textblock/textblockEditor.html" },
            viewModel: { injectable: "textblockEditor" },
            preprocess: (element: HTMLElement, knockoutComponentParams: any) => {
                ko.applyBindingsToNode(element, { surface: {} });
            }
        });

        ko.components.register("workshops", {
            template: { fromUrl: "scripts/templates/workshops/workshops.html" },
            viewModel: { injectable: "workshops" },
            preprocess: (element: HTMLElement, knockoutComponentParams: any) => {
                // ko.applyBindingsToNode(element, { surface: {} });
            }
        });

        ko.components.register("settings", {
            template: { fromUrl: "scripts/templates/workshops/settings/settings.html" },
            viewModel: { injectable: "settingsWorkshop" }
        });

        ko.components.register("widgets", {
            template: { fromUrl: "scripts/templates/workshops/widgets/widgets.html" },
            viewModel: { injectable: "widgetsWorkshop" }
        });

        ko.components.register("media", {
            template: { fromUrl: "scripts/templates/workshops/media/media.html" },
            viewModel: { injectable: "mediaWorkshop" }
        });

        ko.components.register("pages", {
            template: { fromUrl: "scripts/templates/workshops/pages/pages.html" },
            viewModel: { injectable: "pagesWorkshop" }
        });

        ko.components.register("page-templates-workshop", {
            template: { fromUrl: "scripts/templates/workshops/pages/pageTemplates.html" },
            viewModel: { injectable: "pageTemplatesWorkshop" }
        });

        ko.components.register("navigation", {
            template: { fromUrl: "scripts/templates/workshops/navigation/navigation.html" },
            viewModel: { injectable: "navigationWorkshop" }
        });

        ko.components.register("navigation-details-workshop", {
            template: { fromUrl: "scripts/templates/workshops/navigation/navigationDetails.html" },
            viewModel: { injectable: "navigationDetailsWorkshop" }
        });

        ko.components.register("page-details-workshop", {
            template: { fromUrl: "scripts/templates/workshops/pages/pageDetails.html" },
            viewModel: { injectable: "pageDetailsWorkshop" }
        });

        ko.components.register("page-selector", {
            template: { fromUrl: "scripts/templates/workshops/pageSelector/pageSelector.html" },
            viewModel: { injectable: "pageSelector" }
        });

        ko.components.register("media-selector", {
            template: { fromUrl: "scripts/templates/workshops/mediaSelector/mediaSelector.html" },
            viewModel: { injectable: "mediaSelector" }
        });

        ko.components.register("formatting", {
            template: { fromUrl: "scripts/templates/widgets/textblock/formatting/formatting.html" },
            viewModel: { injectable: "formattingTools" }
        });

        ko.components.register("hyperlink-editor", {
            template: { fromUrl: "scripts/templates/widgets/textblock/hyperlink/hyperlinkEditor.html" },
            viewModel: { injectable: "hyperlinkEditor" }
        });

        ko.components.register("paper-textblock", {
            viewModel: () => { },
            preprocess: (element: HTMLElement, knockoutComponentParams: any) => {
                // THIS IS WRAPPER, PROBABLY IT SHOULD BECOME A CLASS AND BE MORE FORMALIZED

                document.addEventListener("dblclick", (event) => {
                    if ($(event.target).closest(element).length > 0) {
                        
                        var htmlEditor = injector.resolve<Vienna.Editing.IHtmlEditor>("htmlEditor");
                        htmlEditor.enable();
                        htmlEditor.setCaretAt(event.clientX, event.clientY);
                    }
                });
            }
        });

        ko.components.register("paper-page", {
            viewModel: () => { },
            preprocess: (element: HTMLElement, knockoutComponentParams: any) => {
                var pageContentWidget = injector.resolve<Vienna.Widgets.PageWidget>("pageWidget");
                ko.applyBindingsToNode(element, { content: pageContentWidget.pageContent });
            }
        });

        ko.components.register("view-manager", {
            template: { fromUrl: "scripts/templates/ui/viewManager.html" },
            viewModel: { injectable: "viewManager" }
        });

        ko.components.register("dropbucket", {
            template: { fromUrl: "scripts/templates/workshops/dropbucket/dropbucket.html" },
            viewModel: { injectable: "dropbucket" }
        });

        ko.components.register("gtm", {
            template: { fromUrl: "scripts/templates/widgets/gtm/gtm.html" },
            viewModel: { injectable: "gtm" }
        });

        ko.components.register("analytics", {
            viewModel: { injectable: "analytics" }
        });

        ko.components.register("abtesting", {
            viewModel: { injectable: "abtesting" }
        });

        /***  THEME  ***/
        ko.components.register("navbar", {
            template: { fromUrl: "scripts/templates/widgets/navbar/navbar.html" },
            viewModel: { injectable: "navbarWidget" }
        });
    }
}