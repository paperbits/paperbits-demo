/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import Vue from "vue";
import template from "./click-counter-runtime.html";


export default Vue.component("click-counter-runtime", {
    template: template,

    data: () => {
        return {
            clickCount: 0
        }
    },

    props: {
        initialCount: {
            type: Number,
            default: 0
        }
    },

    methods: {
        increaseCount(): void {
            this.clickCount++;
        }
    },

    watch: {
        async initialCount(newValue: string): Promise<void> {
            this.clickCount = newValue;
        }
    },

    mounted(): void {
        this.clickCount = this.initialCount;
    }
});
