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