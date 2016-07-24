module Vienna.Editing.Aloha {
    export interface IAlohaEvent {
        type: string;
        nativeEvent: any;
        editable: any;
        selection: any;
        dnd: any;
        preventSelection: boolean;
    }
}