import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
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

  await app.listen(4000);
}
bootstrap();
