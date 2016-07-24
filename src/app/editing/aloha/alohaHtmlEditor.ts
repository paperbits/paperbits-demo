module Vienna.Editing.Aloha {
    export class AlohaHtmlEditor implements Editing.IHtmlEditor {
        private eventManager: IEventManager;
        private mediaService: Data.IMediaService;
        private disabled: boolean = false;
        private currentStack: Array<HTMLElement>;

        constructor(eventManager: IEventManager, mediaService: Data.IMediaService) {
            // initialization...
            this.eventManager = eventManager;
            this.mediaService = mediaService;

            // rebinding...
            this.setTextAlignment = this.setTextAlignment.bind(this);
            this.getClosestNode = this.getClosestNode.bind(this);
            this.getState = this.getState.bind(this);
            this.insertText = this.insertText.bind(this);
            this.toggleBold = this.toggleBold.bind(this);
            this.toggleItalic = this.toggleItalic.bind(this);
            this.toggleUnderline = this.toggleUnderline.bind(this);
            this.toggleUl = this.toggleUl.bind(this);
            this.toggleOl = this.toggleOl.bind(this);
            this.toggleP = this.toggleP.bind(this);
            this.toggleH1 = this.toggleH1.bind(this);
            this.toggleH2 = this.toggleH2.bind(this);
            this.toggleH3 = this.toggleH3.bind(this);
            this.toggleH4 = this.toggleH4.bind(this);
            this.alignLeft = this.alignLeft.bind(this);
            this.alignCenter = this.alignCenter.bind(this);
            this.alignRight = this.alignRight.bind(this);
            this.justify = this.justify.bind(this);
            this.onAlohaEvent = this.onAlohaEvent.bind(this);
            this.getSelectionBoundaries = this.getSelectionBoundaries.bind(this);
            this.normalizeSelection = this.normalizeSelection.bind(this);
            this.disable = this.disable.bind(this);

            // setting up...
            this.currentStack = [];
            aloha.editor.stack.unshift(this.onAlohaEvent);

            this.eventManager.addEventListener("onEscape", this.disable);
        }

        private isEditable(node): boolean {
            return $(node).closest("PAPER-TEXTBLOCK, TOOLBOX").length > 0;
        }

        private onAlohaEvent(event: IAlohaEvent) {
            if ((event.type == "leave" || event.type == "mousedown") && !this.isEditable(event.nativeEvent.target)) {
                this.disable();
                return event;
            }

            if (this.disabled || !this.isEditable(event.nativeEvent.target)) {
                return event;
            }

            this.currentStack = aloha.dom.childAndParentsUntil(event.nativeEvent.target, aloha.dom.isEditingHost);
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);

            return event;
        }

        private setTextAlignment(alignmentClass: string) {
            var paragraph = this.getClosestNode(formattableNodes);

            $(paragraph)
                .removeClass(ParagraphAlignmentClassNames.alignLeft)
                .removeClass(ParagraphAlignmentClassNames.alignCenter)
                .removeClass(ParagraphAlignmentClassNames.alignRight)
                .removeClass(ParagraphAlignmentClassNames.justify)
                .addClass(alignmentClass);
        }

        private applyFormatting(nodeName) {
            var boundaries = aloha.editor.selection.boundaries;
            aloha.editing.format(boundaries[0], boundaries[1], nodeName.toUpperCase(), boundaries);
        }

        private getSelectionBoundaries() {
            var boundaries = null;
            var selection = aloha.editor.selection;

            if (selection && selection.boundaries) {
                boundaries = aloha.boundaries.get(aloha.boundaries.document(selection.boundaries[0]));
            }
            return boundaries;
        }

        private normalizeSelection(start, end, nodeName) {
            var boundaries = [start, end];

            for (var i = 0; i < boundaries.length; i++) {
                var anchor = aloha.dom.upWhile(aloha.boundaries.container(boundaries[i]), (node) => { return nodeName !== node.nodeName; });

                if (anchor) {
                    return [
                        aloha.boundaries.fromStartOfNode(anchor),
                        aloha.boundaries.fromEndOfNode(anchor)
                    ];
                }
            }
            return aloha.boundaries.equals(start, end)
                ? aloha.traversing.expand(start, end, "word")
                : boundaries;
        }

        public getClosestNode(nodeNames: Array<string>): HTMLElement {
            var boundaries = aloha.editor.selection.boundaries;

            var continueTraversing = node => nodeNames.indexOf(node.nodeName) === -1;

            var element =
                aloha.dom.upWhile(aloha.boundaries.container(boundaries[0]), continueTraversing) ||
                aloha.dom.upWhile(aloha.boundaries.container(boundaries[1]), continueTraversing);

            return element;
        }

        public getState(): SelectionState {
            var formatting = new SelectionState();
            var states = aloha.ui.states(aloha.ui.commands, { selection: aloha.editor.selection });

            formatting.bold = states.bold;
            formatting.italic = states.italic;
            formatting.ol = states.ol;
            formatting.ul = states.ul;
            formatting.underline = states.underline;
            formatting.pre = states.pre;

            if (states.h1)
                formatting.style = "Heading 1";

            if (states.h2)
                formatting.style = "Heading 2";

            if (states.h3)
                formatting.style = "Heading 3";

            if (states.h4)
                formatting.style = "Heading 4";

            if (states.pre)
                formatting.style = "Code snippet";

            if (!formatting.style)
                formatting.style = "Normal";

            var node = this.getClosestNode(formattableNodes);

            if (node) {
                var $paragraph = $(node);

                if (node.nodeName === "BLOCKQUOTE") {
                    formatting.style = "Quote";
                }

                formatting.hyperlink = node.nodeName === "A";
                formatting.alignedLeft = $paragraph.hasClass(ParagraphAlignmentClassNames.alignLeft);
                formatting.alignedCenter = $paragraph.hasClass(ParagraphAlignmentClassNames.alignCenter);
                formatting.alignedRight = $paragraph.hasClass(ParagraphAlignmentClassNames.alignRight);
                formatting.justified = $paragraph.hasClass(ParagraphAlignmentClassNames.justify);
            }

            if (!(formatting.alignedLeft || formatting.alignedCenter || formatting.alignedRight || formatting.justified))
                formatting.alignedLeft = true;

            return formatting;
        }

        public getStack(): Array<HTMLElement> {
            var stack = aloha.dom.childAndParentsUntil(aloha.boundaries.container(aloha.editor.selection.boundaries[0]), aloha.dom.isEditingHost);

            return stack;
        }

        public hyperlink(): HTMLLinkElement {
            var hyperlinkElement = <HTMLLinkElement>this.getClosestNode(["A"]);

            if (!hyperlinkElement) {
                var boundaries = this.getSelectionBoundaries();
                boundaries = this.normalizeSelection(boundaries[0], boundaries[1], "A");

                boundaries = aloha.editing.wrap("A", boundaries[0], boundaries[1]);
                boundaries[0] = aloha.boundaries.next(boundaries[0]);
                boundaries[1] = aloha.boundaries.prev(boundaries[1]);

                hyperlinkElement = aloha.boundaries.container(boundaries[0]);
            }

            return hyperlinkElement;
        }

        public removeHyperlink(): void {
            var hyperlinkElement = <HTMLLinkElement>this.getClosestNode(["A"]);
            if (hyperlinkElement) {
                hyperlinkElement.removeAttribute("href");
            }

            var boundaries = this.getSelectionBoundaries();
            boundaries = this.normalizeSelection(boundaries[0], boundaries[1], "A");

            aloha.selections.select(aloha.editor.selection, boundaries[0], boundaries[1]);

            aloha.ui.command(aloha.ui.commands.unformat)({ selection: aloha.editor.selection });

            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public clearFormatting(): void {
            aloha.ui.command(aloha.ui.commands.unformat)({ selection: aloha.editor.selection });
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public insertText(text: string): void {
            var node = document.createTextNode(text);
            var boundaries = aloha.editor.selection.boundaries;

            aloha.editing.insert(boundaries[0], boundaries[1], node);

            var boundary = aloha.boundaries.fromEndOfNode(node);

            aloha.selections.select(aloha.editor.selection, boundary, boundary);
            aloha.editor.selection.boundaries = [boundary, boundary];
        }

        public insertHtml(html: string): void {
            var node = $(html)[0];
            var boundaries = aloha.editor.selection.boundaries;
            aloha.editing.insert(boundaries[0], boundaries[1], node);
        }

        public getBoxForElement(element: HTMLElement): ISelectionBox {
            var box: ISelectionBox = aloha.carets.box(aloha.boundaries.create(element, 0), aloha.boundaries.create(element, 1));

            return box;
        }

        public toggleBold(): void {
            aloha.ui.command(aloha.ui.commands.bold)({ selection: aloha.editor.selection });
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public toggleItalic(): void {
            aloha.ui.command(aloha.ui.commands.italic)({ selection: aloha.editor.selection });
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public toggleUnderline(): void {
            aloha.ui.command(aloha.ui.commands.underline)({ selection: aloha.editor.selection });
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public toggleUl(): void {
            aloha.ui.command(aloha.ui.commands.ul)({ selection: aloha.editor.selection });
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public toggleOl(): void {
            aloha.ui.command(aloha.ui.commands.ol)({ selection: aloha.editor.selection });
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public toggleP(): void {
            aloha.ui.command(aloha.ui.commands.p)({ selection: aloha.editor.selection });
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public toggleH1(): void {
            aloha.ui.command(aloha.ui.commands.h1)({ selection: aloha.editor.selection });
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public toggleH2(): void {
            aloha.ui.command(aloha.ui.commands.h2)({ selection: aloha.editor.selection });
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public toggleH3(): void {
            aloha.ui.command(aloha.ui.commands.h3)({ selection: aloha.editor.selection });
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public toggleH4(): void {
            aloha.ui.command(aloha.ui.commands.h4)({ selection: aloha.editor.selection });
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public toggleQuote(): void {
            this.applyFormatting("BLOCKQUOTE");
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public toggleCode(): void {
            this.applyFormatting("PRE");
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public alignLeft(): void {
            this.setTextAlignment(ParagraphAlignmentClassNames.alignLeft);
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public alignCenter(): void {
            this.setTextAlignment(ParagraphAlignmentClassNames.alignCenter);
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public alignRight(): void {
            this.setTextAlignment(ParagraphAlignmentClassNames.alignRight);
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public justify(): void {
            this.setTextAlignment(ParagraphAlignmentClassNames.justify);
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public setCaretAtEndOf(node: Node): void {
            var boundary = aloha.boundaries.fromEndOfNode(node);
            aloha.editor.selection = aloha.selections.select(aloha.editor.selection, boundary, boundary);
            this.eventManager.dispatchEvent(Editing.HtmlEditorEvents.onSelectionChange);
        }

        public setCaretAt(clientX: number, clientY: number): void {
            var boundary = aloha.boundaries.fromPosition(
                clientX + aloha.dom.scrollLeft(document),
                clientY + aloha.dom.scrollTop(document),
                document
            );

            aloha.editor.selection = aloha.selections.select(aloha.editor.selection, boundary, boundary);
            this.eventManager.dispatchEvent(HtmlEditorEvents.onSelectionChange);
        }

        public enable() {
            this.disabled = false;

            $("paper-textblock").each((index, element) => {
                aloha(element);
            });
        }

        public disable() {
            this.disabled = true;

            this.eventManager.dispatchEvent(HtmlEditorEvents.onEditoDisabled);

            $("paper-textblock").each((index, element) => {
                if (!aloha.dom.isEditable(element))
                    return;

                aloha.mahalo(element);
            });
        }

        public addSelectionChangeListener(callback: () => void): void {
            this.eventManager.addEventListener(HtmlEditorEvents.onSelectionChange, callback);
        }

        public addEditorDisabledListener(callback: () => void): void {
            this.eventManager.addEventListener(HtmlEditorEvents.onEditoDisabled, callback);
        }
    }
} 