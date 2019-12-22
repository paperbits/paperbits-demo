import * as Utils from "@paperbits/common/utils";

const mousedown = (event: MouseEvent) => {
    if (event.which !== 1) {
        return;
    }
    
    const elements = Utils.elementsFromPoint(document, event.clientX, event.clientY);
    const toggleElement = elements.find(x => x.getAttribute("data-toggle"));

    if (!toggleElement) {
        return;
    }

    const collapsible: HTMLElement = toggleElement.closest(".collapsible");

    if (collapsible) {
        collapsible.classList.toggle("expanded");
    }
};

document.addEventListener("mousedown", mousedown, true);