import * as Utils from "@paperbits/common/utils";
import * as Constants from "@paperbits/common/media/constants";
import * as Objects from "@paperbits/common/objects";
import { IObjectStorage, IBlobStorage, Query, Operator, OrderDirection, Page } from "@paperbits/common/persistence";
import { TagContract } from "./tagContract";
import { IMediaWithTagsService } from "./IMediaWithTagsService";
import { MediaContract } from "@paperbits/common/media/mediaContract";

const pageSize = 20;

export class MediaWithTagsService implements IMediaWithTagsService {
    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly blobStorage: IBlobStorage
    ) { }

    public async getMediaByPermalink(permalink: string): Promise<MediaContract> {
        if (!permalink) {
            throw new Error(`Parameter "permalink" not specified.`);
        }

        const query = Query
            .from<MediaContract>()
            .where("permalink", Operator.equals, permalink);

        const pageOfObjects = await this.objectStorage.searchObjects<MediaContract>(Constants.mediaRoot, query);
        const result = pageOfObjects.value;
        const uploads = Object.values(result);

        return uploads.length > 0 ? uploads[0] : null;
    }

    public async getMediaByKey(key: string): Promise<MediaContract> {
        if (!key) {
            throw new Error(`Parameter "key" not specified.`);
        }

        const media = await this.objectStorage.getObject<MediaContract>(key);

        if (!media) {
            console.warn(`Media with key ${key} not found.`);
            return null;
        }

        if (media.blobKey) {
            const downloadUrl = await this.getDownloadUrlFromBlobKey(media.blobKey);
            media.downloadUrl = downloadUrl || media.downloadUrl;
        }

        return media;
    }

    private async getDownloadUrlFromBlobKey(blobKey: string): Promise<string> {
        try {
            return await this.blobStorage.getDownloadUrl(blobKey);
        }
        catch (error) {
            // TODO: Check for 404
        }
        return undefined;
    }

    private async convertPage(pageOfMedia: Page<MediaContract>): Promise<Page<MediaContract>> {
        for (const media of pageOfMedia.value) {
            if (!media.blobKey) {
                continue;
            }

            media.downloadUrl = await this.getDownloadUrlFromBlobKey(media.blobKey);
        }

        const resultPage: Page<MediaContract> = {
            value: pageOfMedia.value,
            takeNext: async (): Promise<Page<MediaContract>> => {
                const nextPage = await pageOfMedia.takeNext();
                return this.convertPage(nextPage);
            }
        };

        if (!pageOfMedia.takeNext) {
            resultPage.takeNext = null;
        }

        return resultPage;
    }

    public async search(query: Query<MediaContract>): Promise<Page<MediaContract>> {
        if (!query) {
            throw new Error(`Parameter "query" not specified.`);
        }

        try {
            const pageOfResults = await this.objectStorage.searchObjects<MediaContract>(Constants.mediaRoot, query);
            const pageOfMedia = this.convertPage(pageOfResults);

            return pageOfMedia;

        }
        catch (error) {
            throw new Error(`Unable to search media: ${error.stack || error.message}`);
        }
    }

    public async deleteMedia(media: MediaContract): Promise<void> {
        if (!media) {
            throw new Error(`Parameter "media" not specified.`);
        }

        try {
            await this.objectStorage.deleteObject(media.key);
            await this.blobStorage.deleteBlob(media.blobKey);
        }
        catch (error) {
            // TODO: Do proper handling.
            console.warn(error);
        }
    }

    public createMedia(name: string, content: Uint8Array, mimeType?: string): Promise<MediaContract> {
        const blobKey = Utils.guid();
        const mediaKey = `${Constants.mediaRoot}/${blobKey}`;
        const media: MediaContract = {
            key: mediaKey,
            fileName: name,
            blobKey: blobKey,
            description: "",
            keywords: "",
            permalink: `/content/${name}`,
            mimeType: mimeType
        };
        return this.uploadContent(content, media);
    }

    public async createMediaUrl(name: string, downloadUrl: string, mimeType?: string): Promise<MediaContract> {
        const blobKey = Utils.guid();
        const mediaKey = `${Constants.mediaRoot}/${blobKey}`;
        const media: MediaContract = {
            key: mediaKey,
            fileName: name,
            blobKey: undefined,
            downloadUrl: downloadUrl,
            description: "",
            keywords: "",
            permalink: `/content/${name}`,
            mimeType: mimeType
        };
        await this.updateMedia(media);
        return media;
    }

    private async uploadContent(content: Uint8Array, media: MediaContract): Promise<MediaContract> {
        await this.blobStorage.uploadBlob(media.blobKey, content, media.mimeType);
        await this.objectStorage.updateObject(media.key, media);

        media.downloadUrl = await this.blobStorage.getDownloadUrl(media.blobKey);

        return media;
    }

    public updateMedia(media: MediaContract): Promise<void> {
        if (!media) {
            throw new Error(`Parameter "media" not specified.`);
        }

        return this.objectStorage.updateObject(media.key, media);
    }

    public updateMediaContent(media: MediaContract, content: Uint8Array): Promise<MediaContract> {
        if (!media) {
            throw new Error(`Parameter "media" not specified.`);
        }
        if (!content) {
            throw new Error(`Parameter "content" not specified.`);
        }

        return this.uploadContent(content, media);
    }

    public async searchTags(query: Query<TagContract>): Promise<Page<TagContract>> {
        if (!query) {
            throw new Error(`Parameter "query" not specified.`);
        }

        try {
            const mediaQuery = Query.from<MediaContract>().where("tags", Operator.notEmpty).orderBy("fileName");
            let mediaPage = await this.search(mediaQuery);
            const mediaItems = mediaPage.value;
            while (mediaPage?.takeNext) {
                mediaPage = await mediaPage.takeNext();
                mediaPage && mediaItems.push(...mediaPage.value);
            }
            let resultItems: string[] =  [];
            for (let i = 0; i < mediaItems.length; i++) {
                mediaItems[i].tags && resultItems.push(...mediaItems[i].tags);   
            }

            const tags = resultItems.filter((x, i, a) => a.indexOf(x) === i).map(item => <TagContract>{key: item, name: item });

            return this.searchObjectsInCollection<TagContract>(query, tags);

        }
        catch (error) {
            throw new Error(`Unable to search media: ${error.stack || error.message}`);
        }
    }

    public async createTag(tag: TagContract): Promise<void> {
        if (!tag) {
            throw new Error(`Parameter "tag" not specified.`);
        }

        await this.objectStorage.addObject<TagContract>(tag.key, tag);
    }

    public async removeTag(tag: TagContract): Promise<void> {
        if (!tag) {
            throw new Error(`Parameter "tag" not specified.`);
        }

        await this.objectStorage.deleteObject(tag.key);
    }

    public searchObjectsInCollection<T>(query: Query<T>, collection: any[]): Page<T> {
        if (query) {
            if (query.filters.length > 0) {
                collection = collection.filter(x => {
                    let meetsCriteria = true;

                    for (const filter of query.filters) {
                        let left = Objects.getObjectAt<any>(filter.left, x);
                        let right = filter.right;

                        if (left === undefined) {
                            meetsCriteria = false;
                            continue;
                        }

                        if (typeof left === "string") {
                            left = left.toUpperCase();
                        }

                        if (typeof right === "string") {
                            right = right.toUpperCase();
                        }

                        const operator = filter.operator;

                        switch (operator) {
                            case Operator.notEmpty:
                                if (typeof left === "string") {
                                    meetsCriteria = !left;
                                    break;
                                }
                                if (Array.isArray(left)) {
                                    meetsCriteria = left && left.length > 0;
                                }
                                break;
                            case Operator.contains:
                                if(Array.isArray(left) && Array.isArray(right)) {
                                    meetsCriteria = right.filter(value => left.includes(value))?.length > 0;
                                    break;
                                }

                                if (left && !left.includes(right)) {
                                    meetsCriteria = false;
                                }
                                break;

                            case Operator.equals:
                                if (left !== right) {
                                    meetsCriteria = false;
                                }
                                break;

                            default:
                                throw new Error("Cannot translate operator into Firebase Realtime Database query.");
                        }
                    }

                    return meetsCriteria;
                });
            }

            if (query.orderingBy) {
                const property = query.orderingBy;

                collection = collection.sort((x, y) => {
                    const a = Objects.getObjectAt<any>(property, x);
                    const b = Objects.getObjectAt<any>(property, y);
                    const modifier = query.orderDirection === OrderDirection.accending ? 1 : -1;

                    if (a > b) {
                        return modifier;
                    }

                    if (a < b) {
                        return -modifier;
                    }

                    return 0;
                });
            }
        }

        const value = Objects.clone<T[]>(collection.slice(0, pageSize));

        return new StaticPage(value, collection, pageSize);
    }
}

class StaticPage<T> implements Page<T> {
    constructor(
        public readonly value: T[],
        private readonly collection: any,
        private readonly skip: number,
    ) {
        if (skip > this.collection.length) {
            this.takeNext = null;
        }
    }

    public async takePrev?(): Promise<Page<T>> {
        throw new Error("Not implemented");
    }

    public async takeNext?(): Promise<Page<T>> {
        const value = this.collection.slice(this.skip, this.skip + pageSize);
        const skipNext = this.skip + pageSize;
        const nextPage = new StaticPage<T>(value, this.collection, skipNext);

        return nextPage;
    }
}