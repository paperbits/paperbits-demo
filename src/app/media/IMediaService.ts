module Vienna.Data {
    export interface IMediaService {
        getMediaByKey(key: string): Promise<IMedia>;

        getByPermalink(permalink: string): Promise<IMedia>;

        search(pattern: string): Promise<Array<IMedia>>;

        deleteMedia(media: IMedia): Promise<void>;

        createMedia(file: File): ProgressPromise<IMedia>;

        updateMedia(media: IMedia): Promise<void>;

        uploadFromUrl(url: string): ProgressPromise<IMedia>;
    }
} 