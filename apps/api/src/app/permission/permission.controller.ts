import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreatePermissionUseCase } from '@apps/api/src/use-cases/permission';
import { AuthGuard } from '@core/guards/auth.guard';
import { Permission, User } from '@domain/entities';
import { RequestUser } from '@core/decorators/user.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly createPermissionUseCase: CreatePermissionUseCase) {}

  @Post()
  @UseGuards(AuthGuard)
  async createPermission(@Body() payload: CreatePermissionDto, @RequestUser() user: User): Promise<Permission> {
    return await this.createPermissionUseCase.execute(payload, user);
  }
}
