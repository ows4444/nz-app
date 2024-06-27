import { entities } from '@domain/entities';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        Object.assign(configService.get<TypeOrmModuleOptions>('typeorm'), {
          entities: entities,
          migrations: [],
          insecureAuth: true,
        } as TypeOrmModuleOptions),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(entities),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
