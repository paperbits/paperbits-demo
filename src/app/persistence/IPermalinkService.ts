module Vienna {
    import IPermalink = Vienna.Data.IPermalink;

    export interface IPermalinkService {
        isPermalinkUrl(url: string): boolean;
        isPermalinkExists(permalink: string): Promise<IPermalink>;
        createPermalink(uri: string, targetLocation: string): Promise<IPermalink>;
        getPermalink(permalink: string): Promise<IPermalink>;
        getPermalinkByKey(permalinkId: string): Promise<IPermalink>;
        getPermalinkByUrl(uri: string): Promise<IPermalink>;
        updatePermalink(permalink: IPermalink): Promise<void>;
    }
}