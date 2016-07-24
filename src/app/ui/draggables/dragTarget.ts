module Vienna.Ui {
    export class DragTarget {
        private dragManager: DragManager;

        public element: HTMLElement;
        public config: IDragTargetConfig;

        constructor(element: HTMLElement, config: IDragTargetConfig, dragManager: DragManager) {
            this.element = element;
            this.config = config;
            this.dragManager = dragManager;

            this.onPointerMove = this.onPointerMove.bind(this);

            element.addEventListener("mousemove", this.onPointerMove, false);
        }

        private onPointerMove(event: PointerEvent) {
            event.stopPropagation();

            if (!this.dragManager.dragged)
                return;

            var clientRect = this.element.getBoundingClientRect();

            if (!(event.pageX > (clientRect.left + window.scrollX) &&
                event.pageX < (clientRect.right + window.scrollX) &&
                event.pageY > (clientRect.top + window.scrollY) &&
                event.pageY < (clientRect.bottom + window.scrollY))) {
                return;
            }

            var readyToAccept = this.config.accept && this.config.accept(this.dragManager.payload, this.dragManager.dragged);

            if (readyToAccept) {
                var before: boolean = false;

                if (this.config.flow === "vertical") {
                    before = (event.pageY + clientRect.height / 2) < clientRect.bottom;

                    if (before && this.config.onacceptbefore) {
                        this.config.onacceptbefore(this.dragManager.dragged, this.element);
                    }

                    if (!before && this.config.onacceptafter) {
                        this.config.onacceptafter(this.dragManager.dragged, this.element);
                    }
                }

                if (this.config.flow === "horizontal") {
                    before = (event.pageX + clientRect.width / 2) < clientRect.right;

                    if (before && this.config.onacceptbefore) {
                        this.config.onacceptbefore(this.dragManager.dragged, this.element);
                    }

                    if (!before && this.config.onacceptafter) {
                        this.config.onacceptafter(this.dragManager.dragged, this.element);
                    }
                }

                this.dragManager.setAcceptor(this, before);
            }
        }
    }
}