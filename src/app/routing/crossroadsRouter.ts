module Vienna {
    export module Navigation {
        export class CrossroadsRouter implements Vienna.IRouter {
            constructor() {
                this.parseHash = this.parseHash.bind(this);
            }

            private parseHash(newHash, oldHash) {
                crossroads.parse(newHash);
            }

            public addRoute(pattern: any, handler: Function, priority?: number) {
                crossroads.addRoute(pattern, handler, priority);
            }

            public startListening() {
                crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;

                hasher.initialized.add(this.parseHash);
                hasher.changed.add(this.parseHash);
                hasher.init();
            }
        }
    }
}