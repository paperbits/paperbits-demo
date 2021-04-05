import * as ko from "knockout";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { TagItem } from "./tagItem";
import { MediaItem } from "@paperbits/core/workshops/media/ko/mediaItem";

export class MediaWithTagsItem extends MediaItem {
    public tags: ko.ObservableArray<TagItem>;

    constructor(mediaContract: MediaContract) {
        super(mediaContract);
        this.tags = ko.observableArray<TagItem>(TagItem.fromNames(mediaContract.tags));
    }

    public toMedia(): MediaContract {
        return {
            key: this.key,
            blobKey: this.blobKey,
            fileName: this.fileName(),
            description: this.description(),
            keywords: this.keywords(),
            mimeType: this.mimeType(),
            downloadUrl: this.downloadUrl(),
            permalink: this.permalink(),
            tags: TagItem.fromItems(this.tags())
        };
    }

    public getHyperlink(): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = this.fileName();
        hyperlinkModel.target = "_download";
        hyperlinkModel.targetKey = this.key;
        hyperlinkModel.href = this.permalink();

        return hyperlinkModel;
    }
}