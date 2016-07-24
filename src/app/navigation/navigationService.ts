module Vienna.Data {
    export class NavigationService implements INavigationService {
        private eventManager: IEventManager;
        private objectStorage: Persistence.IObjectStorage;

        constructor(eventManager: IEventManager, objectStorage: Persistence.IObjectStorage) {
            this.eventManager = eventManager;
            this.objectStorage = objectStorage;

            // rebinding....
            this.getNavigationItem = this.getNavigationItem.bind(this);
            this.addNavigationItemUpdateListener = this.addNavigationItemUpdateListener.bind(this);
        }

        public getNavigationItem(name: string): Promise<Data.Navigation.INavigationItem> {
            var path = "{0}/{1}".format(StorageType[StorageType.navigationItems], name);
            return this.objectStorage.getObject<Data.Navigation.INavigationItem>(path);
        }

        public getNavigationItems(): Promise<Array<Data.Navigation.INavigationItem>> {
            var path = "{0}".format(StorageType[StorageType.navigationItems]);

            return this.objectStorage.searchObjects<Data.Navigation.INavigationItem>(path);
        }

        public updateNavigationItem(navigationItem: Data.Navigation.INavigationItem): Promise<void> {
            var path = "{0}/{1}".format(StorageType[StorageType.navigationItems], navigationItem.key);
            
            this.objectStorage.updateObject(path, navigationItem);
            this.eventManager.dispatchEvent(NavigationEvents.onNavigationItemUpdate, navigationItem);

            return Promise.resolve(null);
        }

        public addNavigationItemUpdateListener(callback: (navigationItem: Data.Navigation.INavigationItem) => void) {
            this.eventManager.addEventListener(NavigationEvents.onNavigationItemUpdate, callback);
        }
    }
}