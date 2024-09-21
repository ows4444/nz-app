import { CreateThemeUseCase, DeleteThemeUseCase, ListAllThemeUseCase, UpdateThemeUseCase } from '@apps/api/src/use-cases/core';
import { RequestUser } from '@core/decorators/user.decorator';
import { Theme, User } from '@domain/entities';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateThemeDto } from './dto/create-theme.dto';
import { AuthGuard } from '@core/guards/auth.guard';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { ThemeParamDto } from './dto/param-theme.dto';

@Controller('core')
@ApiTags('Core Themes')
export class ThemeController {
  constructor(
    private readonly listAllThemeUseCase: ListAllThemeUseCase,
    private readonly createThemeUseCase: CreateThemeUseCase,
    private readonly updateThemeUseCase: UpdateThemeUseCase,
    private readonly deleteThemeUseCase: DeleteThemeUseCase,
  ) {}

  @Get('themes')
  async getThemes(): Promise<Theme[]> {
    return await this.listAllThemeUseCase.execute();
  }

  @UseGuards(AuthGuard)
  @Post('themes')
  async createTheme(@Body() payload: CreateThemeDto, @RequestUser() user: User): Promise<Theme> {
    return await this.createThemeUseCase.execute(payload, user);
  }

  @UseGuards(AuthGuard)
  @Put('themes/:themeId')
  async updateTheme(@Param() themeParamDto: ThemeParamDto, @Body() payload: UpdateThemeDto, @RequestUser() user: User): Promise<Theme> {
    return await this.updateThemeUseCase.execute(themeParamDto.themeId, payload, user);
  }

  @UseGuards(AuthGuard)
  @Delete('themes/:themeId')
  async deleteTheme(@Param() themeParamDto: ThemeParamDto, @RequestUser() user: User): Promise<Theme> {
    return this.deleteThemeUseCase.execute(themeParamDto.themeId, user);
  }
}
