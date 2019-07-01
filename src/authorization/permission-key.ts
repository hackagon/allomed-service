export const enum PermissionKey {
  // For accessing own (logged in user) profile
  ViewOwnUser = 'ViewOwnUser',
  // For accessing other users profile.
  ViewAnyUser = 'ViewAnyUser',
  // For creating a user
  CreateAnyUser = 'CreateAnyUser',
  // For updating own (logged in user) profile
  UpdateOwnUser = 'UpdateOwnUser',
  // For updating other users profile
  UpdateAnyUser = 'UpdateAnyUser',
  // For deleting a user
  DeleteAnyUser = 'DeleteAnyUser',

  // For accessing a role
  ViewRoles = 'ViewRoles',
  // For creating a role
  CreateRoles = 'CreateRoles',
  // For updating a role info
  UpdateRoles = 'UpdateRoles',
  // For removing a role
  DeleteRoles = 'DeleteRoles',
}
