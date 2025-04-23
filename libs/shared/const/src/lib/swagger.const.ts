import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export interface SwaggerConstant {
  NAME: string;
  OPTIONS: SecuritySchemeObject;
}

export const swaggerConst: Record<string, SwaggerConstant> = {
  ACCESS_TOKEN: {
    NAME: 'access-token',
    OPTIONS: { type: 'http' },
  },
  REFRESH_TOKEN: {
    NAME: 'refresh-token',
    OPTIONS: { type: 'http' },
  },
  DEVICE_ID: {
    NAME: 'deviceId',
    OPTIONS: { type: 'apiKey' },
  },
  // You can add more keys here with the same shape.
};
