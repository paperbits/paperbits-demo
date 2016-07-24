module Vienna.Data {
    export interface IPage {
        key?: string;
        title: string;
        description: string;
        keywords: string;
        contentKey?: string;
        permalinkKey?: string;
    }
}