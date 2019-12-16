/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { YourWidgetModel } from "./yourWidgetModel";


export class YourWidgetHandlers implements IWidgetHandler {
    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "yourWidget",
            displayName: "Your widget",
            iconClass: "paperbits-puzzle-10",
            createModel: async () => {
                return new YourWidgetModel();
            }
        };

        return widgetOrder;
    }
}