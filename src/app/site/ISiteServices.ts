module Vienna {
    export interface ISiteService {
        setFavicon(media: Data.IMedia): Promise<void> ;
        setTitle(title: string): Promise<void> ;
        setKeywords(keywords: string): Promise<void> ;
        setDescription(description: string): Promise<void> ;
        getSiteSettings(): Promise<Data.ISiteSettings>;
    }
}