import { IUserService } from "@paperbits/common/user/IUserService";

export class StaticUserService implements IUserService {
    constructor() { }

    public async getUserPhotoUrl(): Promise<string> {
        return "http://cdn.paperbits.io/images/portrait.svg";
    }
}