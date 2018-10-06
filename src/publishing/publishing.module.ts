import "setimmediate";
import { IInjector } from "@paperbits/common/injection";
import { IBlobStorage } from "@paperbits/common/persistence";
import { SitePublisher } from "./sitePublisher";
import { PagePublisher } from "./pagePublisher";
import { BlogPublisher } from "./blogPublisher";
import { MediaPublisher } from "./mediaPublisher";
import { AssetPublisher } from "./assetPublisher";


export class PublishingNodeModule {
    public register(injector: IInjector): void {
        const inputBlobStorage = injector.resolve<IBlobStorage>("inputBlobStorage");
        const outputBlobStorage = injector.resolve<IBlobStorage>("outputBlobStorage");

        injector.bindInstance("assetPublisher", new AssetPublisher(inputBlobStorage, outputBlobStorage, "assets"));
        injector.bindSingleton("sitePublisher", SitePublisher);
        injector.bindSingleton("pagePublisher", PagePublisher);
        injector.bindSingleton("blogPublisher", BlogPublisher);
        injector.bindSingleton("mediaPublisher", MediaPublisher);

        const pagePublisher = injector.resolve("pagePublisher");
        const mediaPublisher = injector.resolve("mediaPublisher");
        const assetPublisher = injector.resolve("assetPublisher");
        const blogPublisher = injector.resolve("blogPublisher");
        const emailPublisher = injector.resolve("emailPublisher");

        injector.bindInstance("publishers", [
            assetPublisher,
            mediaPublisher,
            emailPublisher,
            blogPublisher,
            pagePublisher
        ]);
    }
}