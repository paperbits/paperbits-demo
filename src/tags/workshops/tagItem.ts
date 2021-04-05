import { TagContract } from "../tagContract";

export class TagItem {
    public id: string;
    public name: string;
    public description: string;

    constructor(contract: TagContract) {
        this.id = contract.key;
        this.name = contract.name;
        this.description = contract.description;
    }

    public static fromNames(items: string[]): TagItem[] {
        return items?.map(tag => new TagItem({key: `tags/${tag}`, name: tag})) || [];
    }

    public static fromItems(items: TagItem[]): string[] {
        return items?.map(tag => tag.name) || [];
    }

    public toContract(): TagContract {
        return {
            key: `tags/${this.name}`, 
            name: this.name, 
            description: this.description 
        };
    }

    public static toContractFromName(tagName: string, description?: string): TagContract {
        return {
            key: `tags/${tagName}`, 
            name: tagName, 
            description: description 
        };
    }
}