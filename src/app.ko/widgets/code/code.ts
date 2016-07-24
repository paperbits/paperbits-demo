module Vienna.Widgets.Code {
    export class Code implements IWidgetModel {
        public lang: KnockoutObservable<string>;
        public code: KnockoutObservable<string>;
        public theme: KnockoutObservable<string>;
        public isEditable: KnockoutObservable<boolean>;

        constructor(lang: string, code: string, theme: string) {
            this.code = ko.observable<string>(code);
            this.lang = ko.observable<string>(lang);
            this.theme = ko.observable<string>(theme);
            this.isEditable = ko.observable<boolean>(false);
        }

        public getStateMap(): any {
            return {
                lang: this.lang,
                code: this.code,
                theme: this.theme
            }
        }
    }
}