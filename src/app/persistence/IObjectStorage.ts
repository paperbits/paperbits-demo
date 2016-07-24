module Vienna.Persistence {
    export interface IObjectStorage {
        addObject(path: string, dataObject: any): Promise<void>;

        getObject<T>(path: string): Promise<T>;

        deleteObject(path: string): Promise<void>;

        updateObject<T>(path: string, dataObject: T): Promise<void>;

        searchObjects<T>(path: string, propertyNames?: Array<string>, searchValue?: string, startAtSearch?: boolean, skipLoadObject?: boolean): Promise<Array<T>>;
    }
}