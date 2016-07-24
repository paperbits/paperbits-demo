module Vienna.Editing {
    export var formattableNodes = ["P", "B", "OL", "UL", "H1", "H2", "H3", "H4", "A", "BLOCKQUOTE"];

    export class ParagraphAlignmentClassNames {
        static alignLeft = "text-left";
        static alignCenter = "text-center";
        static alignRight = "text-right";
        static justify = "text-justify";
    }

    export class SelectionState {
        public style: string;
        public alignment: string;
        public bold: boolean;
        public italic: boolean;
        public ol: boolean;
        public ul: boolean;
        public underline: boolean;
        public pre: boolean;
        public alignedLeft: boolean;
        public alignedCenter: boolean;
        public alignedRight: boolean;
        public justified: boolean;
        public hyperlink: boolean;
    }

    export interface ISelectionBox {
        top: number;
        left: number;
        width: number;
        height: number;
    }

    export interface IHtmlEditor {
        getState(): SelectionState;
        getClosestNode(nodeNames: Array<string>): HTMLElement;
        insertText(text: string): void;
        insertHtml(html: string): void;
        getBoxForElement(element: HTMLElement): ISelectionBox;
        toggleBold(): void;
        toggleItalic(): void;
        toggleUnderline(): void;
        toggleUl(): void;
        toggleOl(): void;
        toggleP(): void;
        toggleH1(): void;
        toggleH2(): void;
        toggleH3(): void;
        toggleH4(): void;
        toggleQuote(): void;
        toggleCode(): void;
        alignLeft(): void;
        alignCenter(): void;
        alignRight(): void;
        hyperlink(): HTMLLinkElement;
        removeHyperlink(): void;
        clearFormatting(): void;
        justify(): void;
        getStack(): Array<HTMLElement>;
        addSelectionChangeListener(callback: () => void): void;
        addEditorDisabledListener(callback: () => void): void;
        setCaretAtEndOf(node: Node): void;
        setCaretAt(clientX: number, clientY: number): void;
        enable();
        disable();
    }

    export class HtmlEditorEvents {
        static onSelectionChange = "onSelectionChange";
        static onEditoDisabled = "onEditorDisabled";
    }
} 