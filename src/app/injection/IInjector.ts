module Vienna {
    export interface IInjector {
        bind(name: string, transient: any): void;
        bindSingleton(name: string, singletone: any): void;
        bindComponent<T>(name: string, factory: (ctx: IInjector, params?: any) => T): void;
        bindInstance<T>(name: string, instance: T): void;
        bindFactory<T>(name, factory: (ctx: IInjector) => T): void;
        resolve<TImplementationType>(runtimeIdentifier: string): TImplementationType;
    }
}