import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateRoleUseCase, AttachPermissionToRoleUseCase } from '@apps/api/src/use-cases/role';
import { AuthGuard } from '@core/guards/auth.guard';
import { Role, RolePermission, User } from '@domain/entities';
import { RequestUser } from '@core/decorators/user.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { AttachRolePermissionDto } from './dto/attach-role-permission.dto';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly attachPermissionToRoleUseCase: AttachPermissionToRoleUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createRole(@Body() payload: CreateRoleDto, @RequestUser() user: User): Promise<Role> {
    return await this.createRoleUseCase.execute(payload, user);
  }

  @Get('/:roleId/permissions/:permissionId')
  @UseGuards(AuthGuard)
  async attachPermission(@Param() { permissionId, roleId }: AttachRolePermissionDto, @RequestUser() user: User): Promise<RolePermission> {
    return await this.attachPermissionToRoleUseCase.execute(permissionId, roleId, user);
  }
}
