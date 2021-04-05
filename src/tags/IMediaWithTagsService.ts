import { Query, Page } from "@paperbits/common/persistence";
import { IMediaService } from "@paperbits/common/media/IMediaService";
import { TagContract } from "./tagContract";

/**
 * Service for managing media files.
 */
 export interface IMediaWithTagsService extends IMediaService {
    /**
     * Searches for tags that contain specified pattern.
     * @param query {Query<TagContract>} Search query.
     */
     searchTags?(query: Query<TagContract>): Promise<Page<TagContract>>;
    
     /**
     * Add tag that contain specified pattern.
     * @param tag {TagContract}
     */
     createTag?(tag: TagContract): Promise<void>;
    
     /**
     * Remove tag that contain specified pattern.
     * @param tag {TagContract}
     */
     removeTag?(tag: TagContract): Promise<void>;
}