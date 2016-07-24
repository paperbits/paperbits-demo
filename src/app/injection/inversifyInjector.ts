module Vienna {
    export class InversifyInjector implements IInjector {
        private kernel: inversify.Kernel;

        constructor() {
            this.kernel = new inversify.Kernel();

            this.bindSingleton = this.bindSingleton.bind(this);
            this.bind = this.bind.bind(this);
            this.bindComponent = this.bindComponent.bind(this);
        }

        public bind(name: string, transient: any): void {
            this.kernel.bind(new inversify.TypeBinding(name, transient, inversify.TypeBindingScopeEnum.Transient));
        }

        public bindSingleton(name: string, singletone: any): void {
            this.kernel.bind(new inversify.TypeBinding(name, singletone, inversify.TypeBindingScopeEnum.Singleton));
        }

        public bindComponent<T>(name, factory: (ctx: IInjector, params?: any) => T): void {
            var construct: any = function () {
                this.factory = factory;
            }
            this.kernel.bind(new inversify.TypeBinding(name, construct, inversify.TypeBindingScopeEnum.Singleton));
        }

        public bindFactory<T>(name, factory: (ctx: IInjector) => T): void {
            var injector = this;

            var construct: any = function () {
                return factory(injector);
            }
            this.kernel.bind(new inversify.TypeBinding(name, construct, inversify.TypeBindingScopeEnum.Singleton));
        }

        public bindInstance<T>(name: string, instance: T): void {
            var construct: any = () => instance;
            this.kernel.bind(new inversify.TypeBinding(name, construct, inversify.TypeBindingScopeEnum.Singleton));
        }

        public resolve<TImplementationType>(runtimeIdentifier: string): TImplementationType {
            return this.kernel.resolve<TImplementationType>(runtimeIdentifier);
        }
    }
}