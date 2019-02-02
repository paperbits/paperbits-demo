import "setimmediate";
import { createDocument } from "@paperbits/core/ko/knockout-rendring";
import { IInjector } from "@paperbits/common/injection";
import { SitePublisher } from "./sitePublisher";
import { PagePublisher } from "./pagePublisher";
import { BlogPublisher } from "./blogPublisher";
import { MediaPublisher } from "./mediaPublisher";
import { AssetPublisher } from "./assetPublisher";
import { EmailPublisher } from "@paperbits/emails/publishers";


export class PublishingNodeModule {
    public register(injector: IInjector): void {
        injector.bindSingleton("assetPublisher", AssetPublisher);
        injector.bindSingleton("sitePublisher", SitePublisher);
        injector.bindSingleton("pagePublisher", PagePublisher);
        injector.bindSingleton("blogPublisher", BlogPublisher);
        injector.bindSingleton("mediaPublisher", MediaPublisher);
        injector.bindSingleton("emailPublisher", EmailPublisher);

        createDocument();

        const stylePublisher = injector.resolve("stylePublisher");
        const pagePublisher = injector.resolve("pagePublisher");
        const mediaPublisher = injector.resolve("mediaPublisher");
        const assetPublisher = injector.resolve("assetPublisher");
        const blogPublisher = injector.resolve("blogPublisher");
        const emailPublisher = injector.resolve("emailPublisher");

        injector.bindInstance("publishers", [
            stylePublisher,
            assetPublisher,
            mediaPublisher,
            // emailPublisher,
            // blogPublisher,
            pagePublisher
        ]);
    }
}