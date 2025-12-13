import { createElement, IconNode } from "lucide";
import { iconEmbClassToLucideIcon, paperbitsIconClassToLucideIcon } from "./lucideIconMap";

function getFirstMatchingClass(element: Element, predicate: (className: string) => boolean): string | undefined {
    for (const className of Array.from(element.classList)) {
        if (predicate(className)) {
            return className;
        }
    }

    return undefined;
}

function ensureLucideSvg(element: Element, icon: IconNode, cacheKey: string): void {
    const previouslyRendered = element.getAttribute("data-lucide");
    if (previouslyRendered === cacheKey) {
        return;
    }

    const svg = createElement(icon, {
        // Let CSS and surrounding font-size drive the actual size.
        width: "1em",
        height: "1em",
        // Ensure it inherits current text color.
        color: "currentColor",
        // Keep strokes readable at small sizes.
        "stroke-width": 2
    });

    // Clear existing children (but does not touch ::before pseudo element if font is still active).
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    element.appendChild(svg);
    element.setAttribute("data-lucide", cacheKey);
}

function tryRenderPaperbitsIcon(element: Element): boolean {
    if (!element.classList.contains("paperbits-icon")) {
        return false;
    }

    const iconClass = getFirstMatchingClass(element, className =>
        className.startsWith("paperbits-") &&
        className !== "paperbits-icon" &&
        className !== "paperbits-sm" &&
        className !== "paperbits-lg" &&
        className !== "paperbits-16" &&
        className !== "paperbits-32" &&
        !className.startsWith("paperbits-rotate-") &&
        !className.startsWith("paperbits-flip-") &&
        className !== "paperbits-is-spinning"
    );

    if (!iconClass) {
        return false;
    }

    const key = iconClass.replace(/^paperbits-/, "");
    const iconNode = paperbitsIconClassToLucideIcon[key];

    if (!iconNode) {
        // No mapping => leave as-is (font fallback).
        element.removeAttribute("data-lucide");
        return false;
    }

    ensureLucideSvg(element, iconNode, `paperbits:${key}`);
    return true;
}

function tryRenderEmbeddedIcon(element: Element): boolean {
    if (!element.classList.contains("icon-emb")) {
        return false;
    }

    const iconClass = getFirstMatchingClass(element, className =>
        className.startsWith("icon-emb-") &&
        className !== "icon-emb" &&
        className !== "icon-emb-sm" &&
        className !== "icon-emb-lg" &&
        className !== "icon-emb-16" &&
        className !== "icon-emb-32" &&
        !className.startsWith("icon-emb-rotate-") &&
        !className.startsWith("icon-emb-flip-") &&
        className !== "icon-emb-is-spinning"
    );

    if (!iconClass) {
        return false;
    }

    const key = iconClass.replace(/^icon-emb-/, "");
    const iconNode = iconEmbClassToLucideIcon[key];

    if (!iconNode) {
        element.removeAttribute("data-lucide");
        return false;
    }

    ensureLucideSvg(element, iconNode, `icon-emb:${key}`);
    return true;
}

function renderIfIconElement(element: Element): void {
    // Try both icon systems used in this repo.
    tryRenderPaperbitsIcon(element);
    tryRenderEmbeddedIcon(element);
}

function walkAndRender(root: ParentNode): void {
    const asElement = root as unknown as Element;

    if (asElement?.classList) {
        renderIfIconElement(asElement);
    }

    const candidates = (root as ParentNode).querySelectorAll?.(".paperbits-icon, .icon-emb");

    if (!candidates) {
        return;
    }

    candidates.forEach(el => renderIfIconElement(el));
}

/**
 * Enables Lucide icons for existing icon-font markup by injecting SVGs into elements.
 * This lets us migrate without rewriting every template immediately.
 */
export function initializeLucideIcons(documentOrRoot: Document | HTMLElement = document): void {
    const root: ParentNode = documentOrRoot as any;

    // Initial pass.
    walkAndRender(root);

    // Observe additions and class changes (many icons are applied via KO `css:` bindings).
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === "attributes" && mutation.target instanceof Element) {
                renderIfIconElement(mutation.target);
                continue;
            }

            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(node => {
                    if (node instanceof Element) {
                        walkAndRender(node);
                    }
                });
            }
        }
    });

    observer.observe(root as any, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["class"]
    });
}
