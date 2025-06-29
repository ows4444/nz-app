import { Injectable } from '@nestjs/common';
import { BaseSchemaValidator } from '../../core/abstractions/schema-validator.abstract';
import { ValidationResult } from '../../core/types';
import { DynamicSchemaEntity } from '../../domain/entities/dynamic-schema.entity';

@Injectable()
export class ValidationPipeline {
  constructor(private readonly schemaValidator: BaseSchemaValidator) {}

  async validate(schema: DynamicSchemaEntity): Promise<ValidationResult> {
    const result = await this.schemaValidator.validate(schema.properties);

    // Additional business logic validation
    if (result.isValid) {
      const businessValidationResult = this.validateBusinessRules(schema);
      if (!businessValidationResult.isValid) {
        result.isValid = false;
        result.errors.push(...businessValidationResult.errors);
      }
    }

    return result;
  }

  private validateBusinessRules(schema: DynamicSchemaEntity): ValidationResult {
    const errors: string[] = [];

    // Example business rule: Required fields must have a type
    for (const requiredField of schema.getRequiredFields()) {
      if (!schema.hasField(requiredField)) {
        errors.push(`Required field '${requiredField}' is not defined in schema`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    };
  }
}
