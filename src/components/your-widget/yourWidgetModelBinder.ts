/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { IModelBinder } from "@paperbits/common/editing";
import { YourWidgetModel } from "./yourWidgetModel";
import { Contract } from "@paperbits/common";

export class YourWidgetModelBinder implements IModelBinder<YourWidgetModel> {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "your-widget";
    }

    public canHandleModel(model: YourWidgetModel): boolean {
        return model instanceof YourWidgetModel;
    }

    public async contractToModel(contract: Contract): Promise<YourWidgetModel> {
        return new YourWidgetModel();
    }

    public modelToContract(model: YourWidgetModel): Contract {
        const contract: Contract = {
            type: "your-widget"
        };

        return contract;
    }
}
