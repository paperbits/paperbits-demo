module Vienna.Editing {
    const timeBeforeStartDragging = 700;

    export class LayoutEditor {
        private eventManager: IEventManager;
        private viewManager: Ui.ViewManager;
        private selectedWidget: HTMLElement;
        private placeholderElement: HTMLElement;
        private selectionClass = "vienna-widget-selection";
        private containerSelector = ".container";

        public rowSelector = ".row";
        public columnSelector = ".col-md-12,.col-md-11,.col-md-10,.col-md-9,.col-md-8,.col-md-7,.col-md-6,.col-md-5,.col-md-4,.col-md-3,.col-md-2,.col-md-1";

        constructor(eventManager: IEventManager, viewManager: Ui.ViewManager) {
            this.eventManager = eventManager;
            this.viewManager = viewManager;

            // rebinding...
            this.onKeyDown = this.onKeyDown.bind(this);
            this.deleteSelectedWidget = this.deleteSelectedWidget.bind(this);
            this.onNewWidgetDragStart = this.onNewWidgetDragStart.bind(this);
            this.onWidgetDragStart = this.onWidgetDragStart.bind(this);
            this.onWidgetDragEnd = this.onWidgetDragEnd.bind(this);
            this.onAcceptWidgetBeforeRow = this.onAcceptWidgetBeforeRow.bind(this);
            this.onAcceptWidgetAfterRow = this.onAcceptWidgetAfterRow.bind(this);
            this.onAcceptWidgetAfterColumn = this.onAcceptWidgetAfterColumn.bind(this);
            this.onAcceptWidgetBeforeColumn = this.onAcceptWidgetBeforeColumn.bind(this);
            this.onNullPointerMove = this.onNullPointerMove.bind(this);
            this.applyBindingsToWidget = this.applyBindingsToWidget.bind(this);
            this.selectWidget = this.selectWidget.bind(this);
            this.adjustSizes = this.adjustSizes.bind(this);
            this.canAccept = this.canAccept.bind(this);

            // TODO: Close widgetElement editor when widgetElement deleted.

            document.addEventListener("keydown", this.onKeyDown);
        }

        private createPlaceholder(): void {
            this.placeholderElement = $("<div class=\"placeholder\"></div>")[0];
            this.placeholderElement.onmousemove = this.onNullPointerMove;
        }

        private createRow(): HTMLElement {
            return $("<div class=\"row\"></div>")[0];
        }

        private createColumn(): HTMLElement {
            return $("<div></div>")[0];
        }

        private removeGridClasses(element: HTMLElement): void {
            $(element)
                .removeClass("col-md-12")
                .removeClass("col-md-11")
                .removeClass("col-md-10")
                .removeClass("col-md-9")
                .removeClass("col-md-8")
                .removeClass("col-md-7")
                .removeClass("col-md-6")
                .removeClass("col-md-5")
                .removeClass("col-md-4")
                .removeClass("col-md-3")
                .removeClass("col-md-2")
                .removeClass("col-md-1");

        }

        private deleteSelectedWidget(): void {
            if (this.selectedWidget && !this.selectedWidget.classList.contains("aloha-editable")) {
                var parentRow = this.selectedWidget.parentElement.parentElement;

                $(this.selectedWidget).remove();
                this.relayoutRow(parentRow);
            }
        }

        private clearSelection(): void {
            $(document).find("." + this.selectionClass).removeClass(this.selectionClass);

            this.selectedWidget = null;
        }

        private relayoutRows(rows: Array<HTMLElement>): void {
            rows.forEach((row: any) => {
                this.relayoutRow(row);
            });
        }

        private relayoutRow(rowElement: HTMLElement): void {
            $(rowElement)
                .children()
                .each((index, columnElement) => {
                    let numberOfWidgets = $(columnElement).children().length;

                    if (numberOfWidgets === 0) {
                        $(columnElement).remove();
                    }
                });

            let numberOfColumns = $(rowElement).children().length;

            if (numberOfColumns === 0) {
                $(rowElement).remove();
                return;
            }

            var columnSize = Math.floor(12 / numberOfColumns);
            var columnClass = "col-md-" + (columnSize).toString();

            $(rowElement).children().each((index, columnElement: HTMLElement) => {
                this.removeGridClasses(columnElement);
                $(columnElement).addClass(columnClass);
            });
        }

        private onKeyDown(event: KeyboardEvent): void {
            if (event.keyCode === 46) {
                this.deleteSelectedWidget();
            }
        }

        private onNullPointerMove(event: PointerEvent): void {
            event.stopPropagation();
        }

        private onWidgetDragStart(payload, widgetElement: HTMLElement): void {
            this.viewManager.foldEverything();
            this.createPlaceholder();

            var width = widgetElement.clientWidth + "px";
            var height = widgetElement.clientHeight + "px";

            this.placeholderElement.style.width = width;
            this.placeholderElement.style.height = height;

            $(widgetElement).after(this.placeholderElement);
        }

        private selectWidget(widgetElement: HTMLElement) {
            this.clearSelection();
            $(widgetElement).addClass(this.selectionClass);
            this.selectedWidget = widgetElement;
        }

        private adjustSizes(widgetElement: HTMLElement) {
            var placeholderParentColumn = this.placeholderElement.parentElement;
            var placeholderParentRow = placeholderParentColumn.parentElement;

            this.placeholderElement.style.height = placeholderParentRow.clientHeight + "px";
            this.placeholderElement.style.width = placeholderParentColumn.clientWidth + "px";

            widgetElement.style.width = this.placeholderElement.style.width;

            setTimeout(() => {
                if (this.placeholderElement) {
                    this.placeholderElement.style.height = widgetElement.clientHeight + "px";
                }

            }, timeBeforeStartDragging);
        }

        private onAcceptWidgetBeforeRow(widgetElement: HTMLElement, rowElement: HTMLElement): void {
            if (!this.placeholderElement) {
                this.createPlaceholder();
            }

            let placeholderParentColumn = this.placeholderElement.parentElement;
            var placeholderParentRow: HTMLElement;

            if (placeholderParentColumn) {
                placeholderParentRow = placeholderParentColumn.parentElement;

                if (rowElement === placeholderParentRow)
                    return;

                let newRow = this.createRow();
                newRow.appendChild(placeholderParentColumn);

                $(rowElement).before(newRow);

                this.relayoutRows([placeholderParentRow, rowElement, newRow]);
            }
            else {
                var newColumn = this.createColumn();
                newColumn.appendChild(this.placeholderElement);
                let newRow = this.createRow();
                newRow.appendChild(newColumn);
                $(rowElement).before(newRow);

                this.relayoutRows([rowElement, newRow]);
            }

            this.adjustSizes(widgetElement);
        }

        private onAcceptWidgetAfterRow(widgetElement: HTMLElement, rowElement: HTMLElement): void {
            if (!this.placeholderElement) {
                this.createPlaceholder();
            }

            let placeholderParentColumn = this.placeholderElement.parentElement;
            var placeholderParentRow: HTMLElement;

            if (placeholderParentColumn) {
                placeholderParentRow = placeholderParentColumn.parentElement;

                if (rowElement === placeholderParentRow)
                    return;

                let newRow = this.createRow();
                newRow.appendChild(placeholderParentColumn);
                this.applyBindingsToRow(newRow);

                $(rowElement).after(newRow);

                this.relayoutRows([placeholderParentRow, rowElement, newRow]);
            }
            else {
                var newColumn = this.createColumn();
                newColumn.appendChild(this.placeholderElement);
                this.applyBindingsToColumn(newColumn);

                let newRow = this.createRow();
                newRow.appendChild(newColumn);
                $(rowElement).after(newRow);
                this.applyBindingsToRow(newRow);

                this.relayoutRows([rowElement, newRow]);
            }

            this.adjustSizes(widgetElement);
        }

        private onAcceptWidgetBeforeColumn(widgetElement: HTMLElement, columnElement: HTMLElement): void {
            if (!this.placeholderElement) {
                this.createPlaceholder();
            }

            var placeholderParentColumn = this.placeholderElement.parentElement;

            if (placeholderParentColumn) {
                var placeholderParentRow = placeholderParentColumn.parentElement;

                if (columnElement.previousSibling === placeholderParentColumn)
                    return;

                $(columnElement).before(placeholderParentColumn);

                var columnParentRow = columnElement.parentElement;

                this.relayoutRows([placeholderParentRow, columnParentRow]);
            }
            else {
                placeholderParentColumn = this.createColumn();
                placeholderParentColumn.appendChild(this.placeholderElement);
                this.applyBindingsToColumn(placeholderParentColumn);

                $(columnElement).before(placeholderParentColumn);

                let columnParentRow = columnElement.parentElement;

                this.relayoutRows([columnParentRow]);
            }

            this.adjustSizes(widgetElement);
        }

        private onAcceptWidgetAfterColumn(widgetElement: HTMLElement, columnElement: HTMLElement): void {
            if (!this.placeholderElement) {
                this.createPlaceholder();
            }

            var placeholderParentColumn = this.placeholderElement.parentElement;

            if (placeholderParentColumn) {
                var placeholderParentRow = placeholderParentColumn.parentElement;

                if (columnElement.nextSibling === placeholderParentColumn)
                    return;

                $(columnElement).after(placeholderParentColumn);
                let columnParentRow = columnElement.parentElement;

                this.relayoutRows([placeholderParentRow, columnParentRow]);
            }
            else {
                placeholderParentColumn = this.createColumn();
                placeholderParentColumn.appendChild(this.placeholderElement);
                this.applyBindingsToColumn(placeholderParentColumn);

                $(columnElement).after(placeholderParentColumn);

                let columnParentRow = columnElement.parentElement;

                this.relayoutRows([columnParentRow]);
            }

            this.adjustSizes(widgetElement);
        }

        private canAccept(payload, dragged: HTMLElement): boolean {
            return dragged.nodeName.containsOneOf(["PAPER-TEXTBLOCK", "PAPER-CODEBLOCK", "PAPER-AUDIO", "PAPER-VIDEO", "PAPER-PICTURE", "PAPER-GOOGLEMAP", "PAPER-YOUTUBE"]);
        }

        public applyBindingsToWidget(widgetElement: HTMLElement): void {
            ko.applyBindingsToNode(widgetElement, {
                dragsource: {
                    payload: Editing.DataTransferTypes.widget,
                    sticky: true,
                    ondragstart: this.onWidgetDragStart,
                    ondragend: this.onWidgetDragEnd,
                    filter: function () {
                        return !widgetElement.classList.contains("aloha-editable"); //TODO: Remove hard binding to aloha
                    }
                },
                click: () => {
                    this.selectWidget(widgetElement);
                }
            });
        }

        public applyBindingsToColumn(columnElement: HTMLElement): void {
            ko.applyBindingsToNode(columnElement, {
                dragtarget: {
                    flow: "horizontal",
                    accept: this.canAccept,
                    onacceptbefore: this.onAcceptWidgetBeforeColumn,
                    onacceptafter: this.onAcceptWidgetAfterColumn
                }
            });
        }

        public applyBindingsToRow(rowElement: HTMLElement): void {
            ko.applyBindingsToNode(rowElement, {
                dragtarget: {
                    flow: "vertical",
                    accept: this.canAccept,
                    onacceptbefore: this.onAcceptWidgetBeforeRow,
                    onacceptafter: this.onAcceptWidgetAfterRow
                }
            });
        }

        public onNewWidgetDragStart(widgetElement: HTMLElement, event: any): boolean {
            this.viewManager.foldEverything();
            this.createPlaceholder();
            this.clearSelection();
            return true;
        }

        public onWidgetDragEnd(payload, widgetElement: HTMLElement): void {
            this.viewManager.unfoldEverything();

            if (!this.placeholderElement) {
                $(widgetElement).remove();
                return;
            }

            let placeholderParentColumn = this.placeholderElement.parentElement;

            if (!placeholderParentColumn) {
                this.placeholderElement = null;
                return;
            }

            let placeholderParentRow = placeholderParentColumn.parentElement;

            if (!placeholderParentRow) {
                return;
            }

            if (widgetElement) {
                widgetElement.removeAttribute("style");
                $(this.placeholderElement).after(widgetElement);
            }

            $(this.placeholderElement).remove();
            this.placeholderElement = null;

            this.relayoutRows([placeholderParentRow]);
        }
    }
}
