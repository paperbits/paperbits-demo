module Vienna.Data {
    export interface IFile {
        key: string;
        mimeType: string;
        size?: number;
        content: string;
    }
}