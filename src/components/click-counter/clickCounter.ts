/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import Vue from "vue";
import template from "./clickCounter.html";
import { Component, Prop } from "@paperbits/vue/decorators";


@Component({
    selector: "click-counter",
    template: template
})
export class ClickCounter {
    public initialCount: number;

    constructor() {
        this.initialCount = 10;
    }
}


// export const ClickCounter = Vue.component("click-counter", {
//     template: template,
//     // i18n: i18n,
//     data: () => {
//         return {
//             isOpenNewFlow: true
//         }
//     },

//     components: {
//         // Datepicker
//     },

//     props: {
//         restaurantId: {
//             type: String,
//             default: '2033'
//         }
//     },

//     methods: {
//         /**
//          * Opens reservation app popup.
//          */
//         async submit(): Promise<void> {
//             if (!this.hasAvailableTimeForBooking()) {
//                 return;
//             }
//         }
//     },

//     watch: {
//         async restaurantId(newValue: string): Promise<void> {

//         }
//     },

//     async mounted(): Promise<void> {

//     }
// })

