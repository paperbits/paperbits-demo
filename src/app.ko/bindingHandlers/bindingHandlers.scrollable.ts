module Vienna {
    ko.bindingHandlers["scrollable"] = {
        init: (element: HTMLElement, valueAccessor: any) => {
            var $element: any = $(element);
            $element.niceScroll({
                cursorcolor: "rgba(0,0,0,.2)",
                cursorborder: "none"
            });
        }
    }
}