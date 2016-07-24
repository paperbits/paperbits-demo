module Vienna {
    export class GlobalEventHandler {
        private eventManager: IEventManager;

        constructor(eventManager: IEventManager) {
            this.eventManager = eventManager;

            this.onKeyDown = this.onKeyDown.bind(this);
            this.onCtrlS = this.onCtrlS.bind(this);
            this.onEscape = this.onEscape.bind(this);

            this.addDragStartListener = this.addDragStartListener.bind(this);
            this.addDragEnterListener = this.addDragEnterListener.bind(this);
            this.addDragDropListener = this.addDragDropListener.bind(this);
            this.addDragEndListener = this.addDragEndListener.bind(this);
            this.addDragLeaveListener = this.addDragLeaveListener.bind(this);
            this.addDragLeaveScreenListener = this.addDragLeaveScreenListener.bind(this);

            this.onDragStart = this.onDragStart.bind(this);
            this.onDragEnter = this.onDragEnter.bind(this);
            this.onDragOver = this.onDragOver.bind(this);
            this.onDragLeave = this.onDragLeave.bind(this);
            this.onDragDrop = this.onDragDrop.bind(this);
            this.onDragEnd = this.onDragEnd.bind(this);
            this.onPaste = this.onPaste.bind(this);

            document.addEventListener("keydown", this.onKeyDown);
            document.addEventListener("dragenter", this.onDragEnter, true);
            document.addEventListener("dragstart", this.onDragStart, true);
            document.addEventListener("dragover", this.onDragOver, true);
            document.addEventListener("dragleave", this.onDragLeave);
            document.addEventListener("drop", this.onDragDrop, true);
            document.addEventListener("dragend", this.onDragEnd, true);
            document.addEventListener("paste", this.onPaste, true);
        }

        public onKeyDown(event: KeyboardEvent) {
            //console.log(event.keyCode);

            if (event.ctrlKey && event.keyCode === 83) {
                event.preventDefault();
                this.onCtrlS();
            }

            if (event.ctrlKey && event.keyCode === 80) {
                event.preventDefault();
                this.onCtrlP();
            }

            if (event.keyCode === 27) {
                event.preventDefault();
                this.onEscape();
            }
        }

        private onCtrlS() {
            console.log("Saving...");

            this.eventManager.dispatchEvent("onSaveChanges");
        }

        private onCtrlP() {
            console.log("Publishing...");

            this.eventManager.dispatchEvent("onPublish");
        }

        private onEscape() {
            this.eventManager.dispatchEvent("onEscape");
        }

        private onDragStart(event: DragEvent) {
            this.eventManager.dispatchEvent("onDragStart");
        }

        private onDragEnter(event: DragEvent) {
            // event.dataTransfer.types ARE available here!
            
            this.eventManager.dispatchEvent("onDragEnter");
            event.preventDefault();
        }

        private onDragOver(event: DragEvent) {
            event.preventDefault();
            this.eventManager.dispatchEvent("onDragOver");
        }

        private onDragLeave(event: DragEvent) {
            this.eventManager.dispatchEvent("onDragLeave");

            if (event.screenX === 0 && event.screenY === 0) {
                this.eventManager.dispatchEvent("onDragLeaveScreen");
            }
        }

        private onDragDrop(event: DragEvent) {
            this.eventManager.dispatchEvent("onDragDrop", event);

            event.preventDefault();
        }

        private onDragEnd() {
            this.eventManager.dispatchEvent("onDragEnd");
        }

        private onPaste(event: ClipboardEvent) {
            this.eventManager.dispatchEvent("onPaste", event);
        }

        public addDragStartListener(callback) {
            this.eventManager.addEventListener("onDragStart", callback);
        }

        public addDragEnterListener(callback) {
            this.eventManager.addEventListener("onDragEnter", callback);
        }

        public addDragOverListener(callback) {
            this.eventManager.addEventListener("onDragOver", callback);
        }

        public addDragLeaveListener(callback) {
            this.eventManager.addEventListener("onDragLeave", callback);
        }

        public addDragLeaveScreenListener(callback) {
            this.eventManager.addEventListener("onDragLeaveScreen", callback);
        }

        public addDragDropListener(callback) {
            this.eventManager.addEventListener("onDragDrop", callback);
        }

        public addDragEndListener(callback) {
            this.eventManager.addEventListener("onDragEnd", callback);
        }

        public addPasteListener(callback) {
            this.eventManager.addEventListener("onPaste", callback);
        }
    }
}