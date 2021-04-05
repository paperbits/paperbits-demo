import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { TagSelector } from "./tagSelector";
import { TagFilter } from "./tagFilter";
import { MediaWithTagsDetailsWorkshop, MediaWithTagsToolButton, MediaWithTagsWorkshop } from "../";

export class MediaWithTagsWorkshopModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("mediaWithTagsWorkshop", MediaWithTagsWorkshop);
        injector.bind("mediaWithTagsDetailsWorkshop", MediaWithTagsDetailsWorkshop);
        injector.bind("tagSelector", TagSelector);
        injector.bind("tagFilter", TagFilter);
        injector.bindToCollection("workshopSections", MediaWithTagsToolButton);
    }
}