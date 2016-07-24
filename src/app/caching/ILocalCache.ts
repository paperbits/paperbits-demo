module Vienna {
    export interface ILocalCache {
        getKeys(): Array<string>;
        setItem(key: string, value: any): void;
        getItem<T>(key: string): T;
        getOccupiedSpace(): number;
        getRemainingSpace(): number;
        addChangeListener(callback: () => void);
        removeItem(key: string): void;
        clear();
    }
} 