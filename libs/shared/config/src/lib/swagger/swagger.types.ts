export const SWAGGER_ENV = 'SWAGGER_ENV';
export interface SwaggerEnvironment {
  title: string;
  description: string;
  url?: string;
  version?: string;
  generateOpenApiSpec?: boolean;
}
