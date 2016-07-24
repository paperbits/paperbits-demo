module Vienna {
    $(() => {
        var injector = new Vienna.InversifyInjector();
        
        Vienna.registerContainer(injector);
        Vienna.registerComponents(injector);
        Vienna.registerLoaders(injector);

        ko.applyBindings();
    });
}