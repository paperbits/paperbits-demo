module Vienna.Editing {
    const balloonActiveClassName = "vienna-balloon-is-active";

    ko.bindingHandlers["balloon"] = {
        init: (element: HTMLElement, valueAccessor) => {
            var options = valueAccessor();

            var $htmlElement = $(element);
            var $balloonToggle = $htmlElement.find("[data-balloon-toggle]");

            if (options.isOpen) {
                options.isOpen.subscribe((open: boolean) => {
                    if (!open) {
                        $htmlElement.removeClass(balloonActiveClassName);
                    }
                });
            }

            $balloonToggle.click(() => {
                event.preventDefault();
                event.stopImmediatePropagation();

                $(`.${balloonActiveClassName}`).removeClass(balloonActiveClassName);
                $htmlElement.addClass(balloonActiveClassName);

                if (options.isOpen) {
                    options.isOpen(true);
                }
            });

            $htmlElement.find(".vienna-balloon-content").click(() => {
                event.stopImmediatePropagation();
            });

            $(document).click(() => {
                $(`.${balloonActiveClassName}`).removeClass(balloonActiveClassName);
                if (options.isOpen) {
                    options.isOpen(false);
                }
            });
        }
    };
}
