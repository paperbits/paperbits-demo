module Vienna {
    ko.bindingHandlers["background"] = {
        init(element, valueAccessor) {
            var configuration = valueAccessor();
            var url = ko.unwrap(configuration.url);
            var styleObservable = ko.observable();

            var setBackground = (backgroundUrl: string) => {
                styleObservable({ "background-image": "url(\"{0}\")".format(backgroundUrl) });
                ko.applyBindingsToNode(element, { style: styleObservable });
            }

            if (ko.isObservable(configuration.url)) {
                configuration.url.subscribe(setBackground);
            }

            if (url) {
                setBackground(url);
            }

            ko.applyBindingsToNode(element, { style: styleObservable });
        }
    };
}

