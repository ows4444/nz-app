import { CreateRoleUseCase } from './create-role.use-case';
import { AttachPermissionToRoleUseCase } from './attach-permission-to-role.use-case';
import { ListAllRolePermissionsUseCase } from './list-all-role-permissions.use-case';
import { ListAllRolesUseCase } from './list-all-roles.use-case';
import { DetachPermissionFromRoleUseCase } from './detach-permission-from-role.use-case';

export default [CreateRoleUseCase, AttachPermissionToRoleUseCase, ListAllRolePermissionsUseCase, ListAllRolesUseCase, DetachPermissionFromRoleUseCase];
export { CreateRoleUseCase, AttachPermissionToRoleUseCase, ListAllRolePermissionsUseCase, ListAllRolesUseCase, DetachPermissionFromRoleUseCase };
