import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import TypeORMEnvConfigs from '@config/type-orm.config';
import { DatabaseModule } from '@infra/database/database.module';
import { I18nModule, I18nJsonLoader, AcceptLanguageResolver } from 'nestjs-i18n';
import getEnvPath from '@core/helpers/env';
import path from 'path';
import { AuthModule } from './auth/auth.module';
import I18nEnvConfigs, { I18nEnvConfig } from '@config/i18n.config';
import { SessionMiddleware } from '@core/middlewares/session.middleware';
import { CookiesMiddleware } from '@core/middlewares/cookies.middleware';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvPath(process.env),
      load: [TypeORMEnvConfigs, I18nEnvConfigs],
    }),
    DatabaseModule,
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      resolvers: [AcceptLanguageResolver],
      loader: I18nJsonLoader,
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<I18nEnvConfig>('i18n').fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, configService.get<I18nEnvConfig>('i18n').path),
          watch: configService.get<I18nEnvConfig>('i18n').watch,
        },
      }),
    }),
    UserModule,
    AuthModule,
    RoleModule,
    PermissionModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(SessionMiddleware, CookiesMiddleware).forRoutes('*');
  }
}
