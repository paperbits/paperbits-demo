
import "./polyfills";
import { InversifyInjector } from "@paperbits/common/injection";
import { SearchResultOutput } from "./themes/paperbits/scripts/searchResultsOutput";

document.addEventListener("DOMContentLoaded", () => {
    const injector = new InversifyInjector();
    injector.bind("searchResultOutput", SearchResultOutput);
});