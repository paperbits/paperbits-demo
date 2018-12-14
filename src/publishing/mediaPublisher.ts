import { IPublisher } from "@paperbits/common/publishing";
import { IHttpClient } from "@paperbits/common/http";
import { IBlobStorage } from "@paperbits/common/persistence";
import { IMediaService } from "@paperbits/common/media";
import { MediaContract } from "@paperbits/common/media/mediaContract";


export class MediaPublisher implements IPublisher {
    private readonly httpClient: IHttpClient;
    private readonly outputBlobStorage: IBlobStorage;
    private readonly mediaService: IMediaService;

    constructor(httpClient: IHttpClient, mediaService: IMediaService, outputBlobStorage: IBlobStorage) {
        this.httpClient = httpClient;
        this.mediaService = mediaService;
        this.outputBlobStorage = outputBlobStorage;

        this.publish = this.publish.bind(this);
        this.renderMediaFile = this.renderMediaFile.bind(this);
        this.renderMedia = this.renderMedia.bind(this);
    }

    private async renderMediaFile(mediaFile: MediaContract): Promise<void> {
        const response = await this.httpClient.send({ url: mediaFile.downloadUrl });
        await this.outputBlobStorage.uploadBlob(`website\\${mediaFile.permalink}` , response.toByteArray());
    }

    private async renderMedia(mediaFiles: MediaContract[]): Promise<void> {
        const mediaPromises = new Array<Promise<void>>();

        mediaFiles.forEach(mediaFile => {
            console.log(`Publishing media ${mediaFile.filename}...`);
            mediaPromises.push(this.renderMediaFile(mediaFile));
        });

        await Promise.all(mediaPromises);
    }

    public async publish(): Promise<void> {
        const mediaFiles = await this.mediaService.search();
        await this.renderMedia(mediaFiles);
    }
}
