/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */


import { IWidgetHandler } from "@paperbits/common/editing";
import { StyleDefinition } from "@paperbits/common/styles";
import { ClickCounterModel } from "./clickCounterModel";

export class ClickCounterHandlers implements IWidgetHandler {
    public async getWidgetModel(): Promise<ClickCounterModel> {
        return new ClickCounterModel();
    }

    public getStyleDefinitions(): StyleDefinition {
        return {
            colors: {
                labelColor: {
                    displayName: "Label color",
                    defaults: {
                        value: "green"
                    }
                }
            },
            components: {
                clickCounter: {
                    displayName: "Click counter",
                    plugins: ["margin", "padding", "typography"],
                    components: {
                        label: {
                            displayName: "Click counter label",
                            plugins: ["typography", "margin", "border"],
                            defaults: {
                                typography: {
                                    fontSize: 50,
                                    colorKey: "colors/labelColor"
                                }
                            }
                        },
                        button: {
                            displayName: "Button1",
                            plugins: ["typography", "margin", "border"]
                        }
                    }
                }
            }
        };
    }
}