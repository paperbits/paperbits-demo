import * as ko from "knockout";
import template from "./tagSelector.html";
import tagListTemplate from "./tagList.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { IMediaWithTagsService } from "../IMediaWithTagsService";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { Operator, Page, Query } from "@paperbits/common/persistence";
import { TagItem } from "./tagItem";
import { TagContract } from "../TagContract";

@Component({
    selector: "tag-selector",
    template: template,
    childTemplates: { tagList: tagListTemplate }
})
export class TagSelector {
    public readonly tags: ko.ObservableArray<TagItem>;
    public readonly pattern: ko.Observable<string>;
    public readonly empty: ko.Computed<boolean>;
    public readonly canAddTags: ko.Computed<boolean>;
    public readonly availableTags: ko.Computed<TagItem[]>;
    public readonly working: ko.Observable<boolean>;
    private currentPage: Page<TagContract>;

    constructor(
        private readonly mediaService: IMediaWithTagsService
        ) {
        this.tags = ko.observableArray();
        this.pattern = ko.observable("");
        this.working = ko.observable();
        this.selected = ko.observableArray([]);
        this.availableTags = ko.computed<TagItem[]>(() => this.tags().filter(tag => !this.selected().map(x => x.name).includes(tag.name)));
        this.empty = ko.computed(() => this.availableTags().length === 0);
        this.onDismiss = new ko.subscribable<TagItem[]>();
        this.canCreate = false;
    }

    public onDismiss: ko.Subscribable;

    @Event()
    public onChange: (tags: TagItem[]) => void;

    @Param()
    public selected: ko.ObservableArray<TagItem>;

    @Param()
    public canCreate: boolean;

    @OnMounted()
    public async initialize(): Promise<void> {

        await this.searchItems();

        this.pattern.extend(ChangeRateLimit).subscribe(this.searchItems);
    }

    public async searchItems(searchPattern: string = ""): Promise<void> {
        this.working(true);

        this.tags([]);

        const query = Query.from<TagItem>().orderBy("name");

        if (searchPattern) {
            query.where("name", Operator.contains, searchPattern);
        }

        if (this.mediaService.searchTags) {
            const pageOfResults = await this.mediaService.searchTags(query);
            this.currentPage = pageOfResults;

            const pageItems = pageOfResults.value.map(tag => new TagItem(tag));
            this.tags.push(...pageItems);
        }

        this.working(false);
    }

    public async loadNextPage(): Promise<void> {
        if (!this.currentPage?.takeNext) {
            return;
        }

        this.working(true);

        this.currentPage = await this.currentPage.takeNext();

        const pageItems = this.currentPage.value.map(tag => new TagItem(tag));
        this.tags.push(...pageItems);

        this.working(false);
    }

    public addTag(tag: TagItem): void {
        this.selected.push(tag);
        if (this.onChange) {
            this.onChange(this.selected());
            this.onDismiss.notifySubscribers();
        }
    }

    public removeTag(tag: TagItem): void {
        this.selected.remove(tag);
        if (this.onChange) {
            this.onChange(this.selected());
            this.onDismiss.notifySubscribers();
        }
    }

    public async deleteTag(tag: TagItem): Promise<void> {
        await this.mediaService.removeTag(tag.toContract());
        await this.searchItems();
    }

    public async onEnter(data: TagSelector, e: KeyboardEvent): Promise<void> {
        const tagName = this.pattern();
        if(this.canCreate && tagName && e.key === "Enter") {
            const searchTag = this.tags().find(t => t.name === tagName);
            if (!searchTag) {
                const newTag = TagItem.toContractFromName(tagName);
                this.addTag(new TagItem(newTag));
                this.pattern("");
            }
        }
    }
}