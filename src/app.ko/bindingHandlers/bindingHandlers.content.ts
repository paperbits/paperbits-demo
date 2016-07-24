module Vienna {
    import LayoutEditor = Vienna.Editing.LayoutEditor;

    export class ContentBindingHandler {
        constructor(layoutEditor: LayoutEditor) {
            ko.bindingHandlers["content"] = {
                init(element: HTMLElement, valueAccessor) {
                    var observable = valueAccessor();
                    var observer = new MutationObserver(mutations => {
                        observable(element.innerHTML);
                    });

                    observer.observe(element, { attributes: true, childList: true, characterData: true, subtree: true });
                },

                update(element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) {
                    var observable = valueAccessor();

                    if (observable() === element.innerHTML)
                        return;

                    ko.utils.setHtml(element, valueAccessor());
                    ko.applyBindingsToDescendants(bindingContext, element);

                    if (element.nodeName != "PAPER-PAGE") //TODO: Get rid of hard coded tag
                    {
                        return;
                    }

                    $(element)
                        .find(layoutEditor.columnSelector)
                        .each((index, columnElement: HTMLElement) => {
                            $(columnElement)
                                .children()
                                .each((widgetIndex, widgetElement: HTMLElement) => {
                                    layoutEditor.applyBindingsToWidget(widgetElement);
                                });
                        });

                    $(element).find(layoutEditor.rowSelector).each((index, rowElement: HTMLElement) => {
                        layoutEditor.applyBindingsToRow(rowElement);
                    });

                    $(element).find(layoutEditor.columnSelector).each((index, columnElement: HTMLElement) => {
                        layoutEditor.applyBindingsToColumn(columnElement);
                    });
                }
            };
        }
    }
}
