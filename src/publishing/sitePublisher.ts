import { IPublisher } from "@paperbits/common/publishing";

export class SitePublisher implements IPublisher {
    private readonly publishers: IPublisher[];

    constructor(publishers: IPublisher[]) {
        this.publishers = publishers;
    }

    public async publish(): Promise<any> {
        console.info("Publishing...");

        for (const publisher of this.publishers) {
            await publisher.publish();
        }

        console.info("Published successfully.");
    }
}
