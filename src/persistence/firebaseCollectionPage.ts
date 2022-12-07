import { Page } from "@paperbits/common/persistence";
import { pageSize } from "./contants";

export class FirebaseCollectionPage<T> implements Page<T> {
    constructor(
        public readonly value: T[],
        private readonly collection: any,
        private readonly skip: number
    ) {
        if (skip > this.collection.length) {
            this.takeNext = null;
        }
    }

    public async takePrev?(): Promise<Page<T>> {
        throw new Error("Not implemented");
    }

    public async takeNext?(): Promise<Page<T>> {
        const value = this.collection.slice(this.skip, this.skip + pageSize);
        const skipNext = this.skip + pageSize;
        const nextPage = new FirebaseCollectionPage<T>(value, this.collection, skipNext);

        return nextPage;
    }
}
