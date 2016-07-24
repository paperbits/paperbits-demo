module Vienna.Data {

    export class LocalCache implements ILocalCache {
        private lrucache: Cache.LruCache<any>;
        
        constructor() {
            this.lrucache = new Cache.LruCache<any>(10000);
        }

        public getKeys(): Array<string> {
            var keys = new Array<string>();

            for (var key in window.localStorage) {
                if (window.localStorage.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }

            var lrucacheKeys = this.lrucache.getKeys();
            for (var i = 0; i < lrucacheKeys.length; i++) {
                keys.push(lrucacheKeys[i]);
            }

            return keys;
        }

        public setItem(key: string, value: any): void {
            if (this.estimateSize(value) < 10240) {
                this.lrucache.setItem(key, value);
            }
            window.localStorage.setItem(key, JSON.stringify(value));
        }

        public getItem<T>(key: string): T {
            var content = this.lrucache.getItem(key);
            return content ? content : JSON.parse(window.localStorage.getItem(key));
        }

        private estimateSize(object: any) {

            var list = [];
            var stack = [object];
            var bytes = 0;

            while (stack.length) {
                var value = stack.pop();
                if (!value) {
                    continue;
                }
                if (typeof value === 'boolean') {
                    bytes += 4;
                }
                else if (typeof value === 'string') {
                    bytes += value.length * 2;
                }
                else if (typeof value === 'number') {
                    bytes += 8;
                }
                else if (typeof value === 'object' &&
                    list.indexOf(value) === -1
                ) {
                    list.push(value);
                    for (var i in value) {
                        if (value.hasOwnProperty(i)) {
                            stack.push(value[i]);
                        }
                    }
                }
            }
            return bytes;
        }

        public getOccupiedSpace(): number {
            return 0;
        }

        public getRemainingSpace(): number {
            return 0;
        }

        public addChangeListener(callback: () => void) {

        }

        public removeItem(key: string): void {
            this.lrucache.removeItem(key);
            window.localStorage.removeItem(key);
        }

        public clear() {
            this.lrucache.clear();
            window.localStorage.clear();
        }
    }
} 