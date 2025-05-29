import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Environment, ENVIRONMENT_ENV, SwaggerEnvironment, TYPEORM_ENV } from '@nz/config';
import { writeFileSync } from 'fs';
import { join } from 'path';

export function BootstrapSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);

  const logger = new Logger(BootstrapSwagger.name);
  const { isProduction, host, port } = configService.getOrThrow<Environment>(ENVIRONMENT_ENV);
  const { title, description, generateOpenApiSpec, url = 'api-docs', version = '1.0' } = configService.getOrThrow<SwaggerEnvironment>(TYPEORM_ENV);

  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      })
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      operationIdFactory: (controllerKey, methodKey) => methodKey,
      deepScanRoutes: true,
    });

    // Generate OpenAPI spec file for CI/CD
    if (generateOpenApiSpec) {
      const outputPath = join(process.cwd(), 'openapi-spec.json');
      writeFileSync(outputPath, JSON.stringify(document, null, 1));
      logger.log(`OpenAPI spec generated at: ${join(process.cwd(), 'openapi-spec.json')}`);
    }

    logger.log(`Swagger UI available at: http://${host}:${port}/${url}`);

    SwaggerModule.setup(url, app, document, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
        filter: true,
        displayRequestDuration: true,
      },
    });
  }
}
