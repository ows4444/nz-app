import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        throw new BadRequestException({
          message: 'Validation failed',
          error: 'Bad Request',
          data: errors.reduce((acc, error) => {
            acc[error.property] = Object.values(error.constraints);
            return acc;
          }, {}),
        });
      },
    }),
  );

  const config = new DocumentBuilder().setTitle('Api example').setDescription('The API description').setVersion('1.0').addTag('API').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();
