/**
 * Created by mtuchkov on 7/9/2016.
 */



module Vienna.Widgets.Domain.Engagement {
    export class ABTestingService {
        private abValue;

        constructor(private document:Document) {
        }

        public init(totalOptionsCount:number, cookieName: string){
            this.abValue = this.getCookie(document.cookie, cookieName);

            if (!this.abValue) {
                this.abValue = this.generateRandomValue(totalOptionsCount);
            }

            this.setCookie(document, cookieName);

            this.setValue();
        }

        private generateRandomValue(totalOptionsCount:number): number {
            return Math.floor(Math.random() * (totalOptionsCount)) + 1;
        }

        private setCookie(document:Document, cookieName:string) {
            var now = new Date();
            now.setDate(now.getDate() + 365);

            document.cookie =
                cookieName + '=' + this.abValue +
                ';path=/' +
                ';domain=' + document.location.hostname +
                ';max-age=31536000' +
                ';expires=' + now.toUTCString();
        }

        private setValue() {
            var gtm = dataLayer ? dataLayer : (<any>window).dataLayer;
            dataLayer.push({'abValue': this.abValue.toString()})
        }

        public getValue() {
            return this.abValue;
        }

        private getCookie(cookies, name):string {
            var value = "; " + cookies;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        }
    }
}