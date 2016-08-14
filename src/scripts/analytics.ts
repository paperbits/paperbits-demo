module Paperbits.Demo {
    export class Analytics {
        constructor(private gtm: Array<Object>) {
            this.traceData = this.traceData.bind(this);
            this.findCategory = this.findCategory.bind(this);

            document.body.addEventListener("click", this.traceData, true);
        }

        private traceData(event): void {
            var element = event.target;
            if (element.tagName.toLowerCase() == "span" && element.parentElement.tagName.toLowerCase() === "a") {
                element = element.parentElement;
            }

            if (element.tagName.toLowerCase() === "a" || element.tagName.toLowerCase() === "button") {
                var isVienna = element.className.indexOf("vienna-toolbox-button") > -1 ||
                    element.className.indexOf("vienna-button") > -1;

                var label = element.innerText;
                var category = this.findCategory(element);
                var link = element.href;

                this.gtm.push({
                    "event": "ButtonClick",
                    "category": (isVienna ? "Vienna" : "Content") + "." + category,
                    "label": label,
                    "action": link,
                });
            }
        }

        private findCategory(element): string {
            var result = "";
            while (element.tagName.toLowerCase() != "body") {
                switch (element.tagName.toLowerCase()) {
                    case "workshops":
                        return "workshops";
                    case "nav":
                        return "navigation";
                    case "paper-page":
                        return "content";
                    case "dropbucket":
                        return "dropbucket";
                    case "footer":
                        return "footer";
                }
                element = element.parentElement;
            }
            return result;
        }
    }

    export class ABTesting {
        private experimentVersion: string;

        constructor(private gtm: Array<Object>) { }

        public init(totalOptionsCount: number, cookieName: string): void {
            this.experimentVersion = this.getCookie(document.cookie, cookieName);

            if (!this.experimentVersion) {
                this.experimentVersion = this.generateRandomValue(totalOptionsCount).toString();
            }

            this.setCookie(document, cookieName);
            this.gtm.push({ "abValue": this.experimentVersion.toString() })
        }

        private generateRandomValue(totalOptionsCount: number): number {
            return Math.floor(Math.random() * (totalOptionsCount)) + 1;
        }

        private setCookie(document: Document, cookieName: string): void {
            var now = new Date();
            now.setDate(now.getDate() + 365);

            document.cookie =
                cookieName + "=" + this.experimentVersion +
                ";path=/" +
                ";domain=" + document.location.hostname +
                ";max-age=31536000" +
                ";expires=" + now.toUTCString();
        }

        private getCookie(cookies, name): string {
            var value = "; " + cookies;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        }
    }

    var gtm = window["dataLayer"] = window["dataLayer"] || [];

    var abTestingService = new ABTesting(gtm);
    abTestingService.init(2, "ab-testing");

    document.addEventListener("DOMContentLoaded", function (event) {
        new Analytics(gtm);
    });
}