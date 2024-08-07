import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateRoleUseCase, AttachPermissionToRoleUseCase, ListAllRolePermissionsUseCase, ListAllRolesUseCase, DetachPermissionFromRoleUseCase } from '@apps/api/src/use-cases/role';
import { AuthGuard } from '@core/guards/auth.guard';
import { Role, RolePermission, User } from '@domain/entities';
import { RequestUser } from '@core/decorators/user.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { AttachRolePermissionDto } from './dto/attach-role-permission.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('roles')
@ApiTags('Roles')
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly listAllRolesUseCase: ListAllRolesUseCase,
    private readonly attachPermissionToRoleUseCase: AttachPermissionToRoleUseCase,
    private readonly detachPermissionFromRoleUseCase: DetachPermissionFromRoleUseCase,
    private readonly listAllRolePermissionsUseCase: ListAllRolePermissionsUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createRole(@Body() payload: CreateRoleDto, @RequestUser() user: User): Promise<Role> {
    return await this.createRoleUseCase.execute(payload, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getRoles(): Promise<Role[]> {
    return await this.listAllRolesUseCase.execute();
  }

  @Get(':roleId/permissions')
  @UseGuards(AuthGuard)
  async getRolePermissions(@Param('roleId') roleId: number): Promise<RolePermission[]> {
    return await this.listAllRolePermissionsUseCase.execute(roleId);
  }

  @Patch('/:roleId/permissions/:permissionId')
  @UseGuards(AuthGuard)
  async attachPermission(@Param() { permissionId, roleId }: AttachRolePermissionDto, @RequestUser() user: User): Promise<RolePermission> {
    return await this.attachPermissionToRoleUseCase.execute(roleId, permissionId, user);
  }

  @Patch('/:roleId/permissions/:permissionId')
  @UseGuards(AuthGuard)
  async detachPermission(@Param() { permissionId, roleId }: AttachRolePermissionDto, @RequestUser() user: User): Promise<RolePermission> {
    return await this.detachPermissionFromRoleUseCase.execute(roleId, permissionId, user);
  }
}
