import * as $ from "jquery";

$(".sticky-top").each((index, element) => {
    let onScroll = () => {
        if (element.classList.contains("sticky-top")) {
            let scrollY = element.ownerDocument.defaultView.window.scrollY;
            let rect = element.getBoundingClientRect();

            if (rect.top === 0 && scrollY > 3) {
                element.classList.add("sticky-top-shadow");
            }
            else {
                element.classList.remove("sticky-top-shadow");
            }
            return;
        }
    }

    element.ownerDocument.addEventListener("scroll", onScroll);
})