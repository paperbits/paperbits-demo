module Vienna.Ui {
    export class LityLightbox implements ILightbox {
        private lightbox;

        constructor() {
            this.lightbox = lity();
        }

        show(url: string): void {
            this.lightbox(url);
        }
    }
}