/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { Contract } from "@paperbits/common";
import { IModelBinder } from "@paperbits/common/editing";
import { ClickCounterModel } from "./clickCounterModel";
import { ClickCounterContract } from "./clickCounterContract";

export class ClickCounterModelBinder implements IModelBinder<ClickCounterModel> {
    public async contractToModel(contract: ClickCounterContract): Promise<ClickCounterModel> {
        const model = new ClickCounterModel();
        model.initialCount = contract.initialCount || 0;
        model.styles = contract.styles;
        return model;
    }

    public modelToContract(model: ClickCounterModel): Contract {
        const contract: ClickCounterContract = {
            type: "click-counter",
            initialCount: model.initialCount,
            styles: model.styles
        };

        return contract;
    }
}