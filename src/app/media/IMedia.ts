module Vienna.Data {
    export interface IMedia {
        key?: string;
        filename: string;
        description: string;
        keywords: string;
        mimeType: string;
        size: number;
        downloadUrl?: string;
        permalinkKey?: string;
    }
}