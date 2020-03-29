import * as ReactDOM from "react-dom";
import { createElement } from "react";


export function RuntimeComponent(config: any): (target: any) => void {
    return (target) => {
        class RuntimeComponentProxy extends HTMLElement {
            constructor() {
                super();
            }

            public connectedCallback(): void {
                const element = <HTMLElement>this;

                setTimeout(() => {
                    const reactElement = createElement(target, {});
                    ReactDOM.render(reactElement, element);
                }, 10);
            }

            public disconnectedCallback(): void {
                // Not implemented
            }
        }

        customElements.define(config.selector, RuntimeComponentProxy);
    };
}