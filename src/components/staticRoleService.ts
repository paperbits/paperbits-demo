/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { BuiltInRoles, RoleModel, RoleService } from "@paperbits/common/user";

/**
 * Static role service for demo purposes.
 */
export class StaticRoleService implements RoleService {
    public async getRoles(): Promise<RoleModel[]> {
        return [BuiltInRoles.everyone, BuiltInRoles.anonymous, BuiltInRoles.authenticated];
    }
}