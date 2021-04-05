import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import template from "./mediaWithTags.html";
import { IMediaWithTagsService } from "../IMediaWithTagsService";
import { ViewManager, View } from "@paperbits/common/ui";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { EventManager } from "@paperbits/common/events";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { IWidgetService } from "@paperbits/common/widgets";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { Query, Operator, Page } from "@paperbits/common/persistence";
import { TagItem } from "./tagItem";
import { MediaWithTagsItem } from "./mediaWithTagsItem";
import { defaultFileName, defaultURL } from "@paperbits/core/workshops/media/ko/mediaItem";

@Component({
    selector: "media-with-tags",
    template: template
})
export class MediaWithTagsWorkshop {
    private currentPage: Page<MediaContract>;
    public readonly searchPattern: ko.Observable<string>;
    public readonly mediaItems: ko.ObservableArray<MediaWithTagsItem>;
    public readonly selectedMediaItem: ko.Observable<MediaWithTagsItem>;
    public readonly working: ko.Observable<boolean>;
    public tags: TagItem[];
    public groupByTag: ko.Observable<boolean>;
    public readonly taggedGroups: ko.ObservableArray<ItemsGroup<MediaWithTagsItem>>;

    constructor(
        private readonly eventManager: EventManager,
        private readonly mediaService: IMediaWithTagsService,
        private readonly viewManager: ViewManager,
        private readonly widgetService: IWidgetService
    ) {
        this.working = ko.observable(false);
        this.groupByTag = ko.observable(false);
        this.mediaItems = ko.observableArray<MediaWithTagsItem>();
        this.taggedGroups = ko.observableArray<ItemsGroup<MediaWithTagsItem>>();
        this.searchPattern = ko.observable<string>("");
        this.selectedMediaItem = ko.observable<MediaWithTagsItem>();
        this.tags = [];
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.searchMedia();

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchMedia);
    }

    public async searchMedia(searchPattern: string = ""): Promise<void> {
        this.working(true);
        this.mediaItems([]);

        const query = Query
            .from<MediaContract>()
            .orderBy("fileName");

        if (searchPattern) {
            query.where("fileName", Operator.contains, searchPattern);
        }
        
        const searchTags = this.tags.map(t => t.name);
        if (this.groupByTag() && searchTags?.length > 0) {
            query.where("tags", Operator.contains, searchTags);
        }

        const mediaOfResults = await this.mediaService.search(query);
        this.currentPage = mediaOfResults;

        const mediaItems = mediaOfResults.value.map(media => new MediaWithTagsItem(media));
        this.mediaItems.push(...mediaItems);

        this.checkTagging(mediaItems);        

        this.working(false);
    }

    private checkTagging(mediaItems: MediaWithTagsItem[]) {
        const searchTags = this.tags.map(t => t.name);
        const isSearchWithTags = searchTags?.length > 0;
        if(this.groupByTag()) {
            const tags = (isSearchWithTags && searchTags) || this.getAllTags(mediaItems);
            const groups: {[tagName: string]: ItemsGroup<MediaWithTagsItem>} = {};
            for (let i = 0; i < tags.length; i++) {
                const tag = tags[i];
                groups[tag] = new ItemsGroup<MediaWithTagsItem>(tag);
            }

            if (!isSearchWithTags) {
                groups["Untagged"] = new ItemsGroup<MediaWithTagsItem>("Untagged");
            }

            for (let i = 0; i < mediaItems.length; i++) {
                const mediaItem = mediaItems[i];
                if (mediaItem.tags()?.length > 0) {
                    mediaItem.tags().forEach(t => {
                        const tagName = t.name;
                        groups[tagName]?.items.push(mediaItem);
                    });
                } else {
                    groups["Untagged"].items.push(mediaItem);
                }
            }

            this.taggedGroups(Object.values(groups));
        }
    }

    private getAllTags(mediaItems: MediaWithTagsItem[]): string[] {
        let resultItems: string[] =  [];
        for (let i = 0; i < mediaItems.length; i++) {
            mediaItems[i].tags && resultItems.push(...mediaItems[i].tags().map(t => t.name));   
        }

        const tags = resultItems.filter((x, i, a) => a.indexOf(x) === i).sort();
        return tags;
    }

    public async loadNextPage(): Promise<void> {
        if (!this.currentPage?.takeNext || this.working()) {
            return;
        }

        this.working(true);

        this.currentPage = await this.currentPage.takeNext();

        const mediaItems = this.currentPage.value.map(page => new MediaWithTagsItem(page));
        this.mediaItems.push(...mediaItems);
        
        this.checkTagging(this.mediaItems()); 
        
        this.working(false);
    }

    public async uploadMedia(): Promise<void> {
        this.eventManager.dispatchEvent("displayHint", {
            key: "88d9",
            content: `You may upload pictures, videos and other files just by dropping them anywhere in editor window and even make respective widget out of them.`
        });

        const files = await this.viewManager.openUploadDialog();

        this.working(true);

        const uploadPromises = [];

        for (const file of files) {
            const content = await Utils.readFileAsByteArray(file);
            const uploadPromise = this.mediaService.createMedia(file.name, content, file.type);

            this.viewManager.notifyProgress(uploadPromise, "Media library", `Uploading ${file.name}...`);
            uploadPromises.push(uploadPromise);
        }

        await Promise.all(uploadPromises);
        await this.searchMedia();

        this.working(false);
    }

    public async linkMedia(): Promise<void> {
        const mediaContract = await this.mediaService.createMediaUrl(defaultFileName, defaultURL, "image/svg+xml");
        const mediaItem = new MediaWithTagsItem(mediaContract);

        this.mediaItems.push(mediaItem);
        this.selectMedia(mediaItem);
    }

    public selectMedia(mediaItem: MediaWithTagsItem): void {
        this.selectedMediaItem(mediaItem);

        const view: View = {
            heading: "Media file",
            component: {
                name: "media-with-tags-details-workshop",
                params: {
                    mediaItem: mediaItem,
                    onDeleteCallback: () => {
                        this.searchMedia();
                    }
                }
            }
        };

        this.viewManager.openViewAsWorkshop(view);
    }

    public async deleteSelectedMedia(): Promise<void> {
        // TODO: Show confirmation dialog according to mockup
        this.viewManager.closeWorkshop("media-with-tags-details-workshop");

        await this.mediaService.deleteMedia(this.selectedMediaItem().toMedia());
        await this.searchMedia();
    }

    public onDragStart(item: MediaWithTagsItem): HTMLElement {
        item.widgetFactoryResult = item.widgetOrder.createWidget();

        const widgetElement = item.widgetFactoryResult.element;
        const widgetModel = item.widgetFactoryResult.widgetModel;
        const widgetBinding = item.widgetFactoryResult.widgetBinding;

        this.viewManager.beginDrag({
            sourceModel: widgetModel,
            sourceBinding: widgetBinding
        });

        return widgetElement;
    }

    public onDragEnd(item: MediaWithTagsItem): void {
        item.widgetFactoryResult.element.remove();
        const dragSession = this.viewManager.getDragSession();
        const acceptorBinding = dragSession.targetBinding;

        if (acceptorBinding && acceptorBinding.handler) {
            const widgetHandler = this.widgetService.getWidgetHandler(acceptorBinding.handler);
            widgetHandler.onDragDrop(dragSession);
        }

        this.eventManager.dispatchEvent("virtualDragEnd");
    }

    public onKeyDown(item: MediaWithTagsItem, event: KeyboardEvent): void {
        if (event.key === "Delete") {
            this.deleteSelectedMedia();
        }
    }

    public isSelected(media: MediaWithTagsItem): boolean {
        const selectedMedia = this.selectedMediaItem();
        return selectedMedia?.key === media.key;
    }

    public async onTagsChange(tags: TagItem[]): Promise<void> {
        if (this.groupByTag()) {
            this.tags = tags;
            await this.searchMedia();
        }
    }

    public async onGroupByChange(groupByTag: boolean): Promise<void> {
        this.groupByTag(groupByTag);
        await this.searchMedia();
    }
}

class ItemsGroup<T> {
    public groupName: string;
    public items: T[];    
    public collapsed: ko.Observable<boolean>;

    constructor(groupName: string) {
        this.groupName = groupName;
        this.items = [];
        this.collapsed = ko.observable<boolean>(false);
    }

    public toggleCollapsed(): void {
        this.collapsed(!this.collapsed());
    }
}