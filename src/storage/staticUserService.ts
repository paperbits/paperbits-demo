import { IUserService } from "@paperbits/common/user/IUserService";

/**
 * Static user service for demo purposes.
 */
export class StaticUserService implements IUserService {
    constructor() { }

    public async getUserPhotoUrl(): Promise<string> {
        return "http://cdn.paperbits.io/images/portrait.svg";
    }
}