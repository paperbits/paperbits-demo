/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import "./polyfills";
import { InversifyInjector } from "@paperbits/common/injection";
import { SearchResultOutput } from "./themes/paperbits/scripts/searchResultsOutput";

document.addEventListener("DOMContentLoaded", () => {
    const injector = new InversifyInjector();
    injector.bind("searchResultOutput", SearchResultOutput);
});