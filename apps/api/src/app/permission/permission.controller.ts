import { Body, Controller, Get, Post, UseGuards, Patch, Put, Delete, Param } from '@nestjs/common';
import { CreatePermissionUseCase, DeletePermissionUseCase, ListAllPermissionUseCase, UpdatePermissionUseCase } from '@apps/api/src/use-cases/permission';
import { AuthGuard } from '@core/guards/auth.guard';
import { Permission, User } from '@domain/entities';
import { RequestUser } from '@core/decorators/user.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionParamDto } from './dto/param-permission.dto';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly listAllPermissionUseCase: ListAllPermissionUseCase,
    private readonly updatePermissionUseCase: UpdatePermissionUseCase,
    private readonly deletePermissionUseCase: DeletePermissionUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createPermission(@Body() payload: CreatePermissionDto, @RequestUser() user: User): Promise<Permission> {
    return await this.createPermissionUseCase.execute(payload, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getPermissions(): Promise<Permission[]> {
    return this.listAllPermissionUseCase.execute();
  }

  @Patch('/:permissionId/status/:status')
  @UseGuards(AuthGuard)
  async updatePermissionStatus(@Param() param: PermissionParamDto, @RequestUser() user: User): Promise<Permission> {
    return this.updatePermissionUseCase.execute(param.permissionId, { status: param.status }, user);
  }

  @Put('/:permissionId')
  @UseGuards(AuthGuard)
  async updatePermission(@Param() param: PermissionParamDto, @Body() payload: UpdatePermissionDto, @RequestUser() user: User): Promise<Permission> {
    return this.updatePermissionUseCase.execute(param.permissionId, payload, user);
  }

  @Delete('/:permissionId')
  @UseGuards(AuthGuard)
  async deletePermission(@Param() param: PermissionParamDto, @RequestUser() user: User): Promise<Permission> {
    return this.deletePermissionUseCase.execute(param.permissionId, user);
  }
}
