import { FieldType } from '../enums';
import { FieldSchema } from '../interfaces/schema';
import { ValidationResult } from '../types';

export abstract class BaseSchemaValidator {
  abstract validate(schema: Record<string, FieldSchema>, data?: unknown, context?: string): ValidationResult | Promise<ValidationResult>;

  protected validateFieldSchema(fieldName: string, schema: FieldSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!schema.type) {
      errors.push(`Field '${fieldName}' is missing required 'type' property`);
    }

    if (schema.type && !Object.values(FieldType).includes(schema.type as FieldType)) {
      errors.push(`Field '${fieldName}' has an invalid 'type': ${schema.type}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fieldPath: fieldName,
    };
  }

  protected validateDeprecatedField(fieldName: string, schema: FieldSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (schema.deprecated) {
      warnings.push(`Field '${fieldName}' is deprecated${schema.deprecatedSince ? ` since ${schema.deprecatedSince}` : ''}`);
      if (schema.replacedBy) {
        warnings.push(`Field '${fieldName}' should be replaced by '${schema.replacedBy}'`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fieldPath: fieldName,
    };
  }

  protected validatePermissions(fieldName: string, schema: FieldSchema, userRoles: string[] = []): ValidationResult {
    const errors: string[] = [];

    if (schema.permissions && userRoles.length > 0) {
      const hasReadPermission = schema.permissions.read?.some((role) => userRoles.includes(role));
      if (!hasReadPermission) {
        errors.push(`Insufficient permissions to access field '${fieldName}'`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    };
  }
}
