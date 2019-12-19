import { Contract } from "@paperbits/common";

export interface ClickCounterContract extends Contract {
    initialCount: number;
}