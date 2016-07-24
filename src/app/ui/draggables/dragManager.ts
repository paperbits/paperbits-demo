module Vienna.Ui {
    const startDraggingTime = 300;

    export class DragManager {
        private pointerX = 0;
        private pointerY = 0;
        private startDraggingTimeout: number;
        private source: DragSource;
        private acceptor: DragTarget;
        private acceptBefore: boolean;

        public payload: any;
        public dragged: HTMLElement;

        constructor() {
            this.startDragging = this.startDragging.bind(this);
            this.completeDragging = this.completeDragging.bind(this);
            this.onPointerMove = this.onPointerMove.bind(this);
            this.onPointerDown = this.onPointerDown.bind(this);
            this.onPointerUp = this.onPointerUp.bind(this);
            this.setAcceptor = this.setAcceptor.bind(this);
            this.registerDragSource = this.registerDragSource.bind(this);
            this.registerDragTarget = this.registerDragTarget.bind(this);
            this.resetDraggedElementPosition = this.resetDraggedElementPosition.bind(this);

            document.addEventListener("mousemove", this.onPointerMove, true);
            document.addEventListener("mouseup", this.onPointerUp, true);
        }

        private onPointerMove(event: PointerEvent): void {
            this.pointerX = event.clientX;
            this.pointerY = event.clientY;

            if (this.acceptor && this.acceptor.element.classList.contains("accepting")) {
                this.acceptor.element.classList.remove("accepting");
            }

            this.resetDraggedElementPosition();
        }

        private resetDraggedElementPosition(): void {
            if (!this.dragged)
                return;

            var offsetX = this.dragged.clientWidth * this.source.percentageOffsetX / 100;
            var offsetY = this.dragged.clientHeight * this.source.percentageOffsetY / 100;

            this.dragged.style.left = (this.pointerX - offsetX) + "px";
            this.dragged.style.top = (this.pointerY - offsetY) + "px";
        }

        public startDragging(source: DragSource): void {
            this.dragged = source.element;
            this.payload = source.configuration.payload;
            this.source = source;

            if (source.configuration.ondragstart) {
                var replacement = source.configuration.ondragstart(source.configuration.payload, source.element);

                if (replacement) {
                    this.dragged = replacement;
                }
            }

            if (!this.dragged.parentElement) {
                document.body.appendChild(this.dragged);
            }

            // Fixating the sizes
            if (source.configuration.sticky) {
                this.dragged.style.width = this.dragged.clientWidth + "px";
            }
            this.dragged.classList.add("dragged");

            this.resetDraggedElementPosition();
        }

        private completeDragging(): void {
            if (this.acceptor) {
                this.acceptor.element.classList.remove("accepting");

                if (this.acceptor.config.ondrop) {
                    this.acceptor.config.ondrop(this.payload);
                }

                if (this.acceptor.config.ondropbefore && this.acceptBefore) {
                    this.acceptor.config.ondropbefore(this.source.configuration.payload, this.source.element);
                }

                if (this.acceptor.config.ondropafter && !this.acceptBefore) {
                    this.acceptor.config.ondropafter(this.source.configuration.payload, this.source.element);
                }
            }

            this.dragged.classList.remove("dragged");

            if (this.source.configuration.sticky) {
                this.dragged.style.removeProperty("left");
                this.dragged.style.removeProperty("top");
                this.dragged.style.removeProperty("width");
                this.dragged.style.removeProperty("height");
            }

            if (this.source.configuration.ondragend) {
                this.source.configuration.ondragend(this.source.configuration.payload);
            }

            this.payload = null;
            this.dragged = null;
            this.source = null;
            this.acceptor = null;
        }

        private onPointerUp(event: PointerEvent): void {
            clearTimeout(this.startDraggingTimeout);

            if (!this.dragged) {
                return;
            }

            this.completeDragging();
        }

        public registerDragSource(element: HTMLElement, config: IDragSourceConfig): void {
            new DragSource(element, config, this);
        }

        public registerDragTarget(element: HTMLElement, config: IDragTargetConfig): void {
            new DragTarget(element, config, this);
        }

        public onPointerDown(source: DragSource): void {
            if (source.configuration.sticky) {
                this.startDraggingTimeout = setTimeout(() => this.startDragging(source), startDraggingTime);
            }
            else {
                this.startDragging(source);
            }
        };

        public setAcceptor(acceptor: DragTarget, before: boolean): void {
            this.acceptor = acceptor;

            if (!this.acceptor.element.classList.contains("accepting")) {
                this.acceptor.element.classList.add("accepting");
            }

            this.acceptBefore = before;
        }
    }
}