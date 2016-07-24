module Vienna {
    export class Utils {
        public static guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
                s4() + "-" + s4() + s4() + s4();
        }

        public static createComponent(nodeName: string, attributes: Object): HTMLElement {
            var htmlElement = document.createElement(nodeName);
            htmlElement.style.width = "200px";
            Object.keys(attributes).forEach(key => htmlElement.setAttribute(key, attributes[key]));

            ko.applyBindings({}, htmlElement); // VK: Required to force component view model creation and binding.

            return htmlElement;
        }

        public getBrowser(): any {
            var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return { name: 'IE', version: (tem[1] || '') };
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\bOPR\/(\d+)/)
                if (tem != null) { return { name: 'Opera', version: tem[1] }; }
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }

            return {
                name: M[0],
                version: M[1]
            };
        }
    }

    export module Utils {
        export interface IFunctionBag {
            (): void;
            add(item: () => void): IFunctionBag;
        }

        export function createFunctionBag(): IFunctionBag {
            var items: (() => void)[] = [];

            var bag = <IFunctionBag>function () {
                for (var i = 0; i < items.length; i++) {
                    items[i]();
                }
            };
            bag.add = (item): IFunctionBag => {
                items.push(item);
                return bag;
            };

            return bag;
        }
    }
}