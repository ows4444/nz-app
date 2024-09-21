import { CreateComponentUseCase, DeleteComponentUseCase, ListAllComponentUseCase, UpdateComponentUseCase } from '@apps/api/src/use-cases/core';
import { RequestUser } from '@core/decorators/user.decorator';
import { Component, User } from '@domain/entities';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateComponentDto } from './dto/create-component.dto';
import { AuthGuard } from '@core/guards/auth.guard';
import { UpdateComponentDto } from './dto/update-component.dto';
import { ComponentParamDto } from './dto/param-component.dto';

@Controller('core')
@ApiTags('Core Components')
export class ComponentController {
  constructor(
    private readonly listAllComponentUseCase: ListAllComponentUseCase,
    private readonly createComponentUseCase: CreateComponentUseCase,
    private readonly updateComponentUseCase: UpdateComponentUseCase,
    private readonly deleteComponentUseCase: DeleteComponentUseCase,
  ) {}

  @Get('components')
  async getComponents(): Promise<Component[]> {
    return await this.listAllComponentUseCase.execute();
  }

  @UseGuards(AuthGuard)
  @Post('components')
  async createComponent(@Body() payload: CreateComponentDto, @RequestUser() user: User): Promise<Component> {
    return await this.createComponentUseCase.execute(payload, user);
  }

  @UseGuards(AuthGuard)
  @Put('components/:componentId')
  async updateComponent(@Param() componentParamDto: ComponentParamDto, @Body() payload: UpdateComponentDto, @RequestUser() user: User): Promise<Component> {
    return await this.updateComponentUseCase.execute(componentParamDto.componentId, payload, user);
  }

  @UseGuards(AuthGuard)
  @Delete('components/:componentId')
  async deleteComponent(@Param() componentParamDto: ComponentParamDto, @RequestUser() user: User): Promise<Component> {
    return this.deleteComponentUseCase.execute(componentParamDto.componentId, user);
  }
}
