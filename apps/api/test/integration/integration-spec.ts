/* eslint-disable sonarjs/no-duplicate-string */
import { AppModule } from '@apps/api/src/app/app.module';
import { CreateRootUserUseCase, CreateUserUseCase, LoginUserUseCase, AttachRoleToUserUseCase, DetachRoleFromUserUseCase } from '@apps/api/src/use-cases/user';
import { CreatePermissionUseCase, DeletePermissionUseCase, ListAllPermissionUseCase, UpdatePermissionUseCase } from '@apps/api/src/use-cases/permission';
import { CreateRoleUseCase, AttachPermissionToRoleUseCase, ListAllRolePermissionsUseCase, ListAllRolesUseCase, DetachPermissionFromRoleUseCase } from '@apps/api/src/use-cases/role';
import { PermissionStatus, User } from '@domain/entities';
import { Test, TestingModule } from '@nestjs/testing';

describe('All Integration Flow', () => {
  let moduleRef: TestingModule;
  let createRootUserUseCase: CreateRootUserUseCase;
  let createUserUseCase: CreateUserUseCase;
  let loginUserUseCase: LoginUserUseCase;
  let attachRoleToUserUseCase: AttachRoleToUserUseCase;
  let detachRoleFromUserUseCase: DetachRoleFromUserUseCase;

  let createPermissionUseCase: CreatePermissionUseCase;
  let updatePermissionUseCase: UpdatePermissionUseCase;
  let deletePermissionUseCase: DeletePermissionUseCase;
  let listAllPermissionUseCase: ListAllPermissionUseCase;
  let detachPermissionFromRoleUseCase: DetachPermissionFromRoleUseCase;

  let createRoleUseCase: CreateRoleUseCase;
  let attachPermissionToRoleUseCase: AttachPermissionToRoleUseCase;
  let listAllRolePermissionsUseCase: ListAllRolePermissionsUseCase;
  let listAllRolesUseCase: ListAllRolesUseCase;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    createRootUserUseCase = moduleRef.get(CreateRootUserUseCase);
    createUserUseCase = moduleRef.get(CreateUserUseCase);
    loginUserUseCase = moduleRef.get(LoginUserUseCase);
    attachRoleToUserUseCase = moduleRef.get(AttachRoleToUserUseCase);
    detachRoleFromUserUseCase = moduleRef.get(DetachRoleFromUserUseCase);

    createPermissionUseCase = moduleRef.get(CreatePermissionUseCase);
    updatePermissionUseCase = moduleRef.get(UpdatePermissionUseCase);
    deletePermissionUseCase = moduleRef.get(DeletePermissionUseCase);
    listAllPermissionUseCase = moduleRef.get(ListAllPermissionUseCase);

    createRoleUseCase = moduleRef.get(CreateRoleUseCase);
    attachPermissionToRoleUseCase = moduleRef.get(AttachPermissionToRoleUseCase);
    listAllRolePermissionsUseCase = moduleRef.get(ListAllRolePermissionsUseCase);
    listAllRolesUseCase = moduleRef.get(ListAllRolesUseCase);
    detachPermissionFromRoleUseCase = moduleRef.get(DetachPermissionFromRoleUseCase);
  });

  describe('Root User Create FLow', () => {
    let rootUser: User;
    it('should create a root user', async () => {
      const result = await createRootUserUseCase.execute();
      rootUser = result;
      expect(result.id).toBeDefined();
    });

    it('should not create a root user if it already exists', async () => {
      try {
        await createRootUserUseCase.execute();
      } catch (error) {
        expect(error.message).toBe('Root user already exists');
      }
    });

    describe('Login Root User Flow', () => {
      it('should login root user', async () => {
        const result = await loginUserUseCase.execute('root@nizaami.com', 'rootroot');
        expect(result.id).toBeDefined();
      });

      it('should throw error login root user if password is wrong', async () => {
        try {
          await loginUserUseCase.execute('root@nizaami.com', 'rootroot1');
        } catch (error) {
          expect(error.message).toBe('Password incorrect');
        }
      });
    });

    describe('Normal User Create Flow', () => {
      let normalUser: User;
      it('should create a normal user', async () => {
        const result = await createUserUseCase.execute('user1@abcd.com', 'user1', 'User 1', 'user1', rootUser);
        expect(result.id).toBeDefined();
        normalUser = result;
      });
      it('should not create a normal user if it already exists', async () => {
        try {
          await createUserUseCase.execute('user1@abcd.com', 'user1', 'User 1', 'user1', rootUser);
        } catch (error) {
          expect(error.message).toBe('User already exists');
        }
      });

      it('should attach role to user', async () => {
        const role = await createRoleUseCase.execute({ description: 'Rolexyz', name: 'Rolexyz' }, rootUser);
        const result = await attachRoleToUserUseCase.execute(normalUser.id, role.id, rootUser);
        expect(result.id).toBeDefined();
      });

      it('should not attach role to user if role does not exist', async () => {
        try {
          await attachRoleToUserUseCase.execute(normalUser.id, 1000, rootUser);
        } catch (error) {
          expect(error.message).toBe('Role not found');
        }
      });

      it('should not attach role to user if user does not exist', async () => {
        try {
          await attachRoleToUserUseCase.execute(1000, 1, rootUser);
        } catch (error) {
          expect(error.message).toBe('User not found');
        }
      });

      it('should detach role from user', async () => {
        const role = await createRoleUseCase.execute({ description: 'Rolexyz3', name: 'Rolexyz3' }, rootUser);
        const result = await attachRoleToUserUseCase.execute(normalUser.id, role.id, rootUser);
        expect(result.id).toBeDefined();
        const detachResult = await detachRoleFromUserUseCase.execute(normalUser.id, role.id, rootUser);
        expect(detachResult.id).toBeDefined();
      });
    });

    describe('Permission CRUD Flow', () => {
      let permissionId: number;
      it('should create a permission', async () => {
        const result = await createPermissionUseCase.execute({ description: '', name: '' }, rootUser);
        permissionId = result.id;
        expect(result.id).toBeDefined();
      });

      it('should update a permission', async () => {
        const result = await updatePermissionUseCase.execute(permissionId, { name: 'Permission 1 Updated' }, rootUser);
        expect(result.name).toBe('Permission 1 Updated');
      });

      it('should list all permissions', async () => {
        const result = await listAllPermissionUseCase.execute();
        expect(result.length).toBeGreaterThan(0);
      });

      it('should delete a permission', async () => {
        const result = await deletePermissionUseCase.execute(permissionId, rootUser);
        expect(result.id).toBe(permissionId);
      });

      it('should not delete a permission if it does not exist', async () => {
        try {
          await deletePermissionUseCase.execute(permissionId, rootUser);
        } catch (error) {
          expect(error.message).toBe('Permission not found');
        }
      });

      it('should not update a permission if it does not exist', async () => {
        try {
          await updatePermissionUseCase.execute(permissionId, { name: 'Permission 1 Updated', status: PermissionStatus.ACTIVE }, rootUser);
        } catch (error) {
          expect(error.message).toBe('Permission not found');
        }
      });

      it('should not create a permission if it already exists', async () => {
        try {
          const permission = await createPermissionUseCase.execute({ description: 'second', name: 'second' }, rootUser);
          await updatePermissionUseCase.execute(permission.id, { status: PermissionStatus.ACTIVE }, rootUser);
          await createPermissionUseCase.execute({ description: 'second', name: 'second' }, rootUser);
        } catch (error) {
          expect(error.message).toBe('Permission already exists');
        }
      });
    });
    describe('Role CRUD Flow', () => {
      let roleId: number;
      it('should create a role', async () => {
        const result = await createRoleUseCase.execute({ description: 'Role 1', name: 'Role 1' }, rootUser);
        expect(result.id).toBeDefined();
        roleId = result.id;
      });

      it('should not create a role if it already exists', async () => {
        try {
          await createRoleUseCase.execute({ description: 'Role 1', name: 'Role 1' }, rootUser);
        } catch (error) {
          expect(error.message).toBe('Role already exists');
        }
      });

      it('should list all roles', async () => {
        const result = await listAllRolesUseCase.execute();
        expect(result.length).toBeGreaterThan(0);
      });

      it('should attach permission to role', async () => {
        const permission = await createPermissionUseCase.execute({ description: 'Permission 2', name: 'Permission 2' }, rootUser);
        const result = await attachPermissionToRoleUseCase.execute(roleId, permission.id, rootUser);
        expect(result.id).toBeDefined();
      });

      it('should not attach permission to role if permission does not exist', async () => {
        try {
          await attachPermissionToRoleUseCase.execute(roleId, 1000, rootUser);
        } catch (error) {
          expect(error.message).toBe('Permission not found');
        }
      });

      it('should not attach permission to role if role does not exist', async () => {
        try {
          await attachPermissionToRoleUseCase.execute(1000, 1, rootUser);
        } catch (error) {
          expect(error.message).toBe('Role not found');
        }
      });

      it('should detach permission from role', async () => {
        const permission = await createPermissionUseCase.execute({ description: 'Permission 3', name: 'Permission 3' }, rootUser);
        const result = await attachPermissionToRoleUseCase.execute(roleId, permission.id, rootUser);
        expect(result.id).toBeDefined();
        const detachResult = await detachPermissionFromRoleUseCase.execute(roleId, permission.id, rootUser);
        expect(detachResult.id).toBeDefined();
      });

      it('should not detach permission from role if permission does not exist', async () => {
        try {
          await detachPermissionFromRoleUseCase.execute(roleId, 1000, rootUser);
        } catch (error) {
          expect(error.message).toBe('Permission not found');
        }
      });

      it('should not detach permission from role if role does not exist', async () => {
        try {
          await detachPermissionFromRoleUseCase.execute(1000, 1, rootUser);
        } catch (error) {
          expect(error.message).toBe('Role not found');
        }
      });

      it('should not attach permission to role if permission already attached', async () => {
        const permission = await createPermissionUseCase.execute({ description: 'Permission 4', name: 'Permission 4' }, rootUser);
        await attachPermissionToRoleUseCase.execute(roleId, permission.id, rootUser);
        try {
          await attachPermissionToRoleUseCase.execute(roleId, permission.id, rootUser);
        } catch (error) {
          expect(error.message).toBe('Permission already attached to role');
        }
      });

      it('should not detach permission from role if permission not attached', async () => {
        const permission = await createPermissionUseCase.execute({ description: 'Permission 5', name: 'Permission 5' }, rootUser);
        try {
          await detachPermissionFromRoleUseCase.execute(roleId, permission.id, rootUser);
        } catch (error) {
          expect(error.message).toBe('Permission not attached to role');
        }
      });

      it('should list all role permissions', async () => {
        const result = await listAllRolePermissionsUseCase.execute(roleId);
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  afterAll(async () => {
    await moduleRef.close();
  });
});
