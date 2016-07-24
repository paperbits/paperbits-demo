module Vienna {
    export class ProgressPromise<T> implements Promise<T> {
        private _inner: Promise<T>;
        private _progressCallbacks: ((percent: number) => void)[];
        
        constructor(callback: (resolve : (value?: T | Thenable<T>) => void, reject: (error?: any) => void, progress: (percent: number) => void) => void) {
            this._inner = new Promise((resolve, reject) => callback(resolve, reject, this._progress.bind(this)));
            this._progressCallbacks = [];
        }
        
        public progress(callback: (percent: number) => void): ProgressPromise<T> {
            this._progressCallbacks.push(callback);
            return this;
        }
        
        private _progress(percent: number): void {
            this._progressCallbacks.forEach(callback => callback(percent));
        }
        
        public then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U> | void): Promise<U>{
            return this._inner.then(onFulfilled, onRejected);
        }
        
        public catch<U>(onRejected?: (error: any) => U | Thenable<U>): Promise<U> {
            return this._inner.catch(onRejected);
        }
    }
}