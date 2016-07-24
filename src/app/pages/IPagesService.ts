/// <reference path="IPage.ts" />

module Vienna.Data {
    export interface IPageService {
        search(pattern: string): Promise<Array<IPage>>;

        getPageByKey(key: string): Promise<IPage>;

        deletePage(pageRef: IPage): Promise<void>;

        createPage(title: string, description: string, keywords): Promise<IPage>;

        updatePage(pageRef: IPage): Promise<void>;

        createPageContent(html: string): Promise<IFile>;

        getPageContentByKey(key: string): Promise<IFile>;

        updatePageContent(content: IFile): Promise<void>;

        searchTemplates(): Promise<Array<IPageTemplate>>;

        getLayoutByRoute(routeTemplate: string): Promise<ILayout>;
    }
}