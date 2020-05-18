/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */


import { UserService, BuiltInRoles } from "@paperbits/common/user";

/**
 * Static user service for demo purposes.
 */
export class StaticUserService implements UserService {
    public async getUserName(): Promise<string> {
        return "Jane Doe";
    }

    public async getUserPhotoUrl(): Promise<string> {
        return "https://cdn.paperbits.io/images/portrait.svg";
    }

    public async getUserRoles(): Promise<string[]> {
        return [BuiltInRoles.anonymous.key];
    }

    public async setUserRoles(roles: string[]): Promise<void> {
        // Not supported.
    }
}