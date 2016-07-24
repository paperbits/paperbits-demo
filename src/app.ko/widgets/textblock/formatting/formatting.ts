module Vienna.Editing {
    export class FormattingTools {
        private htmlEditor: Editing.IHtmlEditor;

        public bold: KnockoutObservable<boolean>;
        public italic: KnockoutObservable<boolean>;
        public underline: KnockoutObservable<boolean>;
        public ul: KnockoutObservable<boolean>;
        public ol: KnockoutObservable<boolean>;
        public pre: KnockoutObservable<boolean>;
        public style: KnockoutObservable<string>;
        public alignedLeft: KnockoutObservable<boolean>;
        public alignedCenter: KnockoutObservable<boolean>;
        public alignedRight: KnockoutObservable<boolean>;
        public justified: KnockoutObservable<boolean>;

        constructor(htmlEditor: Editing.IHtmlEditor) {
            this.htmlEditor = htmlEditor;

            this.updateFormattingState = this.updateFormattingState.bind(this);

            this.bold = ko.observable<boolean>();
            this.italic = ko.observable<boolean>();
            this.underline = ko.observable<boolean>();
            this.ul = ko.observable<boolean>();
            this.ol = ko.observable<boolean>();
            this.pre = ko.observable<boolean>();
            this.style = ko.observable<string>();
            this.alignedLeft = ko.observable<boolean>();
            this.alignedCenter = ko.observable<boolean>();
            this.alignedRight = ko.observable<boolean>();
            this.justified = ko.observable<boolean>();

            htmlEditor.addSelectionChangeListener(this.updateFormattingState);
        }

        private updateFormattingState() {
            var selectionState = this.htmlEditor.getState();

            this.bold(selectionState.bold);
            this.italic(selectionState.italic);
            this.underline(selectionState.underline);
            this.ul(selectionState.ul);
            this.ol(selectionState.ol);
            this.pre(selectionState.pre);
            this.style(selectionState.style);
            this.alignedLeft(selectionState.alignedLeft);
            this.alignedCenter(selectionState.alignedCenter);
            this.alignedRight(selectionState.alignedRight);
            this.justified(selectionState.justified);
        }

        public toggleBold(): void {
            this.htmlEditor.toggleBold();
        }

        public toggleItalic(): void {
            this.htmlEditor.toggleItalic();
        }

        public toggleUnderline(): void {
            this.htmlEditor.toggleUnderline();
        }

        public toggleUl(): void {
            this.htmlEditor.toggleUl();
        }

        public toggleOl(): void {
            this.htmlEditor.toggleOl();
        }

        public toggleP(): void {
            this.htmlEditor.toggleP();
        }

        public toggleH1(): void {
            this.htmlEditor.toggleH1();
        }

        public toggleH2(): void {
            this.htmlEditor.toggleH2();
        }

        public toggleH3(): void {
            this.htmlEditor.toggleH3();
        }

        public toggleH4(): void {
            this.htmlEditor.toggleH4();
        }

        public toggleQuote(): void {
            this.htmlEditor.toggleQuote();
        }

        public toggleCode(): void {
            this.htmlEditor.toggleCode();
        }

        public alignLeft(): void {
            this.htmlEditor.alignLeft();
        }

        public alignCenter(): void {
            this.htmlEditor.alignCenter();
        }

        public alignRight(): void {
            this.htmlEditor.alignRight();
        }

        public justify(): void {
            this.htmlEditor.justify();
        }

        public clearFormatting(): void {
            this.htmlEditor.clearFormatting();
        }
    }
}