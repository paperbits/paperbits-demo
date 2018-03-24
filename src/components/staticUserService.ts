/**
 * @license
 * Copyright Vienna LLC. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://paperbits.io/license.
 */


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