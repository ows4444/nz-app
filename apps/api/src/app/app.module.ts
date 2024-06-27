import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import TypeORMEnvConfig from '@config/type-orm.config';
import { DatabaseModule } from '@infra/database/database.module';
import { I18nModule, I18nJsonLoader, AcceptLanguageResolver } from 'nestjs-i18n';
import path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [TypeORMEnvConfig],
    }),
    DatabaseModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      resolvers: [AcceptLanguageResolver],
      loaderOptions: {
        path: path.join(__dirname, '../../../', '/i18n/'),
        watch: true,
      },
      loader: I18nJsonLoader,
    }),
  ],
})
export class AppModule {}
