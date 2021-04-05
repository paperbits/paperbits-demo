import * as ko from "knockout";
import template from "./tagFilter.html";
import { Component, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { TagItem } from "./tagItem";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";

@Component({
    selector: "tag-filter",
    template: template
})
export class TagFilter {
    public readonly working: ko.Observable<boolean>;
    public readonly tags: ko.ObservableArray<TagItem>;
    public readonly groupByTag: ko.Observable<boolean>;

    constructor() {
        this.working = ko.observable();
        this.groupByTag = ko.observable();
        this.tags = ko.observableArray([]);
    }

    @Event()
    public onChangeTags: (tags: TagItem[]) => void;

    @Event()
    public onChangeGroupBy: (groupByTag: boolean) => void;

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.groupByTag.extend(ChangeRateLimit).subscribe(this.onGroupByChange);
    }

    public async onTagsChange(tags: TagItem[]): Promise<void> {
        if (this.onChangeTags) {
            this.onChangeTags(tags);
        }
    }

    public async onGroupByChange(groupByTag: boolean): Promise<void> {
        if (this.onChangeGroupBy) {
            this.onChangeGroupBy(groupByTag);
        }
    }
}