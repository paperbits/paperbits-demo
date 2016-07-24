module Vienna.Widgets.Code {
    export interface ICodeConfig {
        theme: string;
        lang?: string;
        code?: string;
        filename?: string;
        onload?: ProgressPromise<string>;
    }
}