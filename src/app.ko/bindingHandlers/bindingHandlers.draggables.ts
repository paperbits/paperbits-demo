module Vienna {
    export class DraggablesBindingHandler {
        public constructor(dragManager: Ui.DragManager) {

            ko.bindingHandlers["dragsource"] = {
                init(element: HTMLElement, valueAccessor: () => IDragSourceConfig) {
                    var config = valueAccessor();
                    dragManager.registerDragSource(element, config);
                }
            };

            ko.bindingHandlers["dragtarget"] = {
                init(element: HTMLElement, valueAccessor: () => IDragTargetConfig) {
                    var config = valueAccessor();
                    dragManager.registerDragTarget(element, config);
                }
            };

        }
    }
}