import { FieldSchema } from '../interfaces/schema';
import { ValidationResult } from '../types';

export abstract class BaseSchemaValidator {
  abstract validate(schema: Record<string, FieldSchema>): ValidationResult | Promise<ValidationResult>;

  protected validateFieldSchema(fieldName: string, schema: FieldSchema): ValidationResult {
    const errors: string[] = [];

    if (!schema.type) {
      errors.push(`Field '${fieldName}' is missing required 'type' property`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    };
  }
}
