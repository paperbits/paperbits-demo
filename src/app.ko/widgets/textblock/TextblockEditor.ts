module Vienna {
    export module Editing {
        export class TextblockEditor {
            private lastRenderedPluginNames: KnockoutObservableArray<string>;
            private htmlEditor: IHtmlEditor;
            private eventManager: IEventManager;
            private nodePluginMaps;

            public viewManager: Ui.ViewManager;
            public pluginNames: KnockoutObservableArray<string>;

            constructor(htmlEditor: IHtmlEditor, eventManager: IEventManager, viewManager: Ui.ViewManager) {
                this.viewManager = viewManager;
                this.htmlEditor = htmlEditor;
                this.eventManager = eventManager;

                // rebinding...
                this.onSelectionChange = this.onSelectionChange.bind(this);
                this.onEditorDisabled = this.onEditorDisabled.bind(this);

                // setting up...
                this.pluginNames = ko.observableArray<string>();
                this.lastRenderedPluginNames = ko.observableArray<string>();
                this.nodePluginMaps = {};
                this.registerToolForNodes("hyperlink-editor", formattableNodes);
                this.registerToolForNodes("formatting", formattableNodes);
                this.htmlEditor.addSelectionChangeListener(this.onSelectionChange);
                this.htmlEditor.addEditorDisabledListener(this.onEditorDisabled);
            }

            private onEditorDisabled() {
                this.pluginNames([]);
            }

            private registerTool(pluginName: string, nodeName: string) {
                if (this.nodePluginMaps[nodeName] == null)
                    this.nodePluginMaps[nodeName] = [];

                this.nodePluginMaps[nodeName].push(pluginName);
            }

            private registerToolForNodes(pluginName: string, nodeNames: Array<string>) {
                nodeNames.forEach(nodeName => this.registerTool(pluginName, nodeName));
            }

            private onSelectionChange() {
                var nodesInSelectionStack = this.htmlEditor.getStack();
                var pluginNames = [];

                nodesInSelectionStack.forEach(node => {
                    var pluginNamesForNode = this.nodePluginMaps[node.nodeName];

                    if (pluginNamesForNode)
                        pluginNames = pluginNames.concat(pluginNamesForNode);
                });

                pluginNames = _.uniq(pluginNames).sort();

                var rerender = !_.all(pluginNames, function (pluginName) {
                    return _.include(this.lastRenderedPluginNames, pluginName);
                }.bind(this));

                if (rerender) {
                    this.lastRenderedPluginNames(pluginNames);
                    this.pluginNames(pluginNames);
                }
            }
        }
    }
}