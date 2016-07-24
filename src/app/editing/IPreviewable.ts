module Vienna.Editing {
    export interface IPreviewable {
        thumbnailUrl(): KnockoutObservable<string>;
    }
}