export const TYPEORM_ENV = 'TYPEORM_ENV';
export interface SwaggerEnvironment {
  title: string;
  description: string;
  url?: string;
  version?: string;
  generateOpenApiSpec?: boolean;
}
