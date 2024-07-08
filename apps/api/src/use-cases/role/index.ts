import { CreateRoleUseCase } from './create-role.use-case';
import { AttachPermissionToRoleUseCase } from './attach-permission-to-role.use-case';
import { ListAllRolePermissionsUseCase } from './list-all-role-permissions.use-case';
import { ListAllRolesUseCase } from './list-all-roles.use-case';

export default [CreateRoleUseCase, AttachPermissionToRoleUseCase, ListAllRolePermissionsUseCase, ListAllRolesUseCase];
export { CreateRoleUseCase, AttachPermissionToRoleUseCase, ListAllRolePermissionsUseCase, ListAllRolesUseCase };
