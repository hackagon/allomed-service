import { Provider } from '@loopback/context';

import { PermissionKey } from '../permission-key';
import { UserPermission, UserPermissionsFn } from '../types';

export class UserPermissionsProvider implements Provider<UserPermissionsFn> {
  constructor() { }

  value(): UserPermissionsFn {
    return (userPermissions, rolePermissions) =>
      this.action(userPermissions, rolePermissions);
  }

  action(
    userPermissions: UserPermission[],
    rolePermissions: PermissionKey[],
  ): PermissionKey[] {
    let perms: PermissionKey[] = [];
    // First add all permissions associated with role
    perms = perms.concat(rolePermissions);
    // Now update permissions based on user permissions
    userPermissions.forEach((userPerm: UserPermission) => {
      if (userPerm.allowed && perms.indexOf(userPerm.permission) < 0) {
        // Add permission if it is not part of role but allowed to user
        perms.push(userPerm.permission);
      } else if (!userPerm.allowed && perms.indexOf(userPerm.permission) >= 0) {
        // Remove permission if it is disallowed for user
        perms.splice(perms.indexOf(userPerm.permission), 1);
      }
    });
    return perms;
  }
}
