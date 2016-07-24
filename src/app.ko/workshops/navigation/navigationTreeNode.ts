module Vienna {
    export class NavigationTreeNode {
        public id: string;
        public label: KnockoutObservable<string>;
        public url: KnockoutObservable<string>;
        public permalinkKey: KnockoutObservable<string>;
        public parent: NavigationTreeNode;
        public nodes: KnockoutObservableArray<NavigationTreeNode>;
        public collapsed: KnockoutObservable<boolean>;
        public dragged: KnockoutObservable<boolean>;
        public hasFocus: KnockoutObservable<boolean>;
        public onUpdate: KnockoutSubscribable<void>;

        constructor(navitem: Data.Navigation.INavigationItem) {
            this.moveNodeLeft = this.moveNodeLeft.bind(this);
            this.moveNodeRight = this.moveNodeRight.bind(this);
            this.onKeyDown = this.onKeyDown.bind(this);
            this.canAccept = this.canAccept.bind(this);
            this.insertBefore = this.insertBefore.bind(this);
            this.insertAfter = this.insertAfter.bind(this);

            this.id = navitem.key;
            this.label = ko.observable<string>(navitem.label);

            this.url = ko.observable<string>(navitem.externalUrl);
            this.permalinkKey = ko.observable<string>(navitem.permalinkKey);
            this.nodes = ko.observableArray<NavigationTreeNode>([]);
            this.collapsed = ko.observable<boolean>(false);
            this.dragged = ko.observable<boolean>(false);
            this.hasFocus = ko.observable<boolean>(false);
            this.onUpdate = new ko.subscribable<void>();

            document.addEventListener("keydown", this.onKeyDown, false);

            this.label.subscribe(() => this.onUpdate.notifySubscribers());
            this.url.subscribe(() => this.onUpdate.notifySubscribers());
        }

        private isSiblingNode(node: NavigationTreeNode): boolean {
            return this.parent && this.parent.nodes.indexOf(node) >= 0;
        }

        private isChildNode(node: NavigationTreeNode): boolean {
            return this.nodes.indexOf(node) >= 0;
        }

        private isUncleNode(node: NavigationTreeNode): boolean {
            return this.parent && this.parent.parent && this.parent.parent.nodes.indexOf(node) >= 0 && this.parent !== node;
        }

        private moveNodeLeft(): void {
            if (!this.parent.parent) {
                return;
            }

            this.parent.nodes.remove(this);
            var ownIndex = this.parent.parent.nodes.indexOf(this.parent);
            this.parent.parent.nodes.splice(ownIndex + 1, 0, this);
            this.parent = this.parent.parent;

            this.onUpdate.notifySubscribers();
        }

        private moveNodeRight(): void {
            var index = this.parent.nodes().indexOf(this);

            if (index === 0) {
                return;
            }

            var previousSibling = this.parent.nodes()[index - 1];
            this.parent.nodes.remove(this);
            this.parent = previousSibling;
            previousSibling.nodes.push(this);

            this.onUpdate.notifySubscribers();
        }

        public canAccept(node: NavigationTreeNode): boolean {
            return this.isSiblingNode(node) || this.isChildNode(node) || this.isUncleNode(node);
        }

        public insertBefore(node: NavigationTreeNode): void {
            if (this.parent && this.isSiblingNode(node) || this.isUncleNode(node) || this.isChildNode(node)) {
                node.parent.nodes.remove(node);
                let ownIndex = this.parent.nodes.indexOf(this);
                this.parent.nodes.splice(ownIndex, 0, node);
                node.parent = this.parent;

                this.onUpdate.notifySubscribers();
            }
        }

        public insertAfter(node: NavigationTreeNode): void {
            if (this.parent && this.isSiblingNode(node) || this.isUncleNode(node)) {
                node.parent.nodes.remove(node);
                let ownIndex = this.parent.nodes.indexOf(this);
                this.parent.nodes.splice(ownIndex + 1, 0, node);
                node.parent = this.parent;

                this.onUpdate.notifySubscribers();
            }

            if (this.parent && this.isChildNode(node)) {
                node.parent.nodes.remove(node);
                let ownIndex = this.parent.nodes.indexOf(this);
                this.parent.nodes.splice(ownIndex, 0, node);
                node.parent = this.parent;

                this.onUpdate.notifySubscribers();
            }
        }

        public toggleCollapsed(): void {
            this.collapsed(!this.collapsed());
        }

        public onKeyDown(event: KeyboardEvent): void {
            if (!this.hasFocus()) {
                return;
            }

            switch (event.keyCode) {
                case 37:
                    //left
                    this.moveNodeLeft();
                    break;
                case 39:
                    //right
                    this.moveNodeRight();
                    break;
                default:
            }
        }

        public remove(): void {
            this.parent.nodes.remove(this);
            this.parent.onUpdate.notifySubscribers();
        }
    }
}
