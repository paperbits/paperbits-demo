module Vienna.Data.LruCache {
    export class LocalStorageCacheStorage {
        private prefix;
        private regexp;

        constructor(namespace) {
            this.prefix = 'cache-storage.' + (namespace || 'default') + '.';
            // Regexp String Escaping from http://simonwillison.net/2006/Jan/20/escape/#p-6
            var escapedPrefix = this.prefix.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            this.regexp = new RegExp('^' + escapedPrefix)
        }

        public get(key) {
            var item = window.localStorage[this.prefix + key];

            if (item)
                return JSON.parse(item);

            return null;
        }

        public set(key, value) {
            window.localStorage[this.prefix + key] = JSON.stringify(value);
        }

        public size(key, value) {
            return this.keys().length;
        }

        public remove(key) {
            var item = this.get(key);

            delete window.localStorage[this.prefix + key];

            return item;
        }

        public keys() {
            var ret = [], p;

            for (p in window.localStorage) {
                if (p.match(this.regexp)) ret.push(p.replace(this.prefix, ''));
            };

            return ret;
        }
    }

    export var Priority = {
        LOW: 1,
        NORMAL: 2,
        HIGH: 4
    };
}