/// <reference path="../http/ihttpclient.ts" />

module Vienna.Data {
    export class JQueryHttpClient implements IHttpClient {
        constructor() {
            this.sendRequest = this.sendRequest.bind(this);
        }

        public sendRequest<T>(request: IHttpRequest): ProgressPromise<T> {
            if (!request.method)
                request.method = "GET";

            if (!request.headers)
                request.headers = [];

            return new ProgressPromise((resolve, reject, progress) => {
                var promise = $.ajax({
                    url: request.url,
                    method: request.method,
                    data: request.body,
                    beforeSend(xhrObj: JQueryXHR) {
                        request.headers.forEach((header) => {
                            xhrObj.setRequestHeader(header.name, header.value);
                        });
                    }
                });

                promise.done(resolve);
                promise.fail(reject);
                promise.progress(progress);
            });
        }
    }
}

