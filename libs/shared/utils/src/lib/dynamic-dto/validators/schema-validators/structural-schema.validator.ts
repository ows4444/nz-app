import { Injectable } from '@nestjs/common';
import { BaseSchemaValidator } from '../../core/abstractions/schema-validator.abstract';
import { FieldType } from '../../core/enums';
import { FieldSchema } from '../../core/interfaces/schema';
import { ValidationResult } from '../../core/types';

@Injectable()
export class StructuralSchemaValidator extends BaseSchemaValidator {
  validate(schema: Record<string, FieldSchema>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
      const fieldValidation = this.validateFieldSchema(fieldName, fieldSchema);
      errors.push(...fieldValidation.errors);
      warnings.push(...fieldValidation.warnings);

      // Additional structural validations
      if (fieldSchema.type === FieldType.ARRAY) {
        const arrayValidation = this.validateArrayField(fieldName, fieldSchema as any);
        errors.push(...arrayValidation.errors);
        warnings.push(...arrayValidation.warnings);
      }

      if (fieldSchema.type === FieldType.OBJECT) {
        const objectValidation = this.validateObjectField(fieldName, fieldSchema as any);
        errors.push(...objectValidation.errors);
        warnings.push(...objectValidation.warnings);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private validateArrayField(fieldName: string, schema: any): ValidationResult {
    const errors: string[] = [];

    if (!schema.items) {
      errors.push(`Array field '${fieldName}' must have an 'items' property`);
    } else if (!schema.items.type) {
      errors.push(`Array field '${fieldName}' items must have a 'type' property`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    };
  }

  private validateObjectField(fieldName: string, schema: any): ValidationResult {
    const errors: string[] = [];

    if (!schema.properties) {
      errors.push(`Object field '${fieldName}' must have a 'properties' property`);
    } else if (typeof schema.properties !== 'object') {
      errors.push(`Object field '${fieldName}' properties must be an object`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    };
  }
}
