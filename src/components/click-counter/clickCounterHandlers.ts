/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { IWidgetHandler } from "@paperbits/common/editing";
import { ClickCounterModel } from "./clickCounterModel";


export class ClickCounterHandlers implements IWidgetHandler {
    public async getWidgetModel(): Promise<ClickCounterModel> {
        return new ClickCounterModel();
    }
}