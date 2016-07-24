module Vienna {
    ko.bindingHandlers["surface"] = {
        init(element, valueAccessor) {
            ko.applyBindingsToNode(element, {
                dragsource: {
                    sticky: false,
                    filter: (clickedElement: HTMLElement) => {
                        return !$(clickedElement).is("INPUT,SELECT,A,BUTTON, .vienna-dropzone, .vienna-dropzone *, .vienna-toolbox-button *");
                    }
                }
            });
        }
    };
}