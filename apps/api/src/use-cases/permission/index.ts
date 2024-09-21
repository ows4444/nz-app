import { CreatePermissionUseCase } from './create-permission.use-case';
import { DeletePermissionUseCase } from './delete-permission.use-case';
import { ListAllPermissionUseCase } from './list-all-permission.use-case';
import { UpdatePermissionUseCase } from './update-permission.use-case';

export default [CreatePermissionUseCase, ListAllPermissionUseCase, UpdatePermissionUseCase, DeletePermissionUseCase];
export { CreatePermissionUseCase, ListAllPermissionUseCase, UpdatePermissionUseCase, DeletePermissionUseCase };
