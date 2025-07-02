import { Injectable } from '@nestjs/common';
import { BaseSchemaValidator } from '../../core/abstractions/schema-validator.abstract';
import { FieldType } from '../../core/enums';
import {
  ArrayFieldSchema,
  BooleanFieldSchema,
  ComputedFieldSchema,
  DateFieldSchema,
  EnumFieldSchema,
  FieldSchema,
  NumberFieldSchema,
  ObjectFieldSchema,
  StringFieldSchema,
} from '../../core/interfaces/schema';
import { ValidationResult } from '../../core/types';

@Injectable()
export class StructuralSchemaValidator extends BaseSchemaValidator {
  validate(schema: Record<string, FieldSchema>, data?: unknown, context = ''): ValidationResult {
    return this.validateSchemaObject(schema, context);
  }

  private validateSchemaObject(schema: Record<string, FieldSchema>, context: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
      const fullPath = context ? `${context}.${fieldName}` : fieldName;

      // Basic field validation
      const fieldValidation = this.validateFieldSchema(fullPath, fieldSchema);
      errors.push(...fieldValidation.errors);
      warnings.push(...fieldValidation.warnings);

      // Type-specific validation
      const typeValidation = this.validateFieldType(fullPath, fieldSchema);
      errors.push(...typeValidation.errors);
      warnings.push(...typeValidation.warnings);

      // Deprecated field validation
      if (fieldSchema.deprecated) {
        const deprecatedValidation = this.validateDeprecatedField(fullPath, fieldSchema);
        errors.push(...deprecatedValidation.errors);
        warnings.push(...deprecatedValidation.warnings);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private validateFieldType(fieldPath: string, schema: FieldSchema): ValidationResult {
    switch (schema.type) {
      case FieldType.ARRAY:
        return this.validateArrayField(fieldPath, schema);
      case FieldType.OBJECT:
        return this.validateObjectField(fieldPath, schema);
      case FieldType.STRING:
        return this.validateStringField(fieldPath, schema);
      case FieldType.NUMBER:
        return this.validateNumberField(fieldPath, schema);
      case FieldType.ENUM:
        return this.validateEnumField(fieldPath, schema);
      case FieldType.BOOLEAN:
        return this.validateBooleanField(fieldPath, schema);
      case FieldType.DATE:
        return this.validateDateField(fieldPath, schema);
      case FieldType.COMPUTED:
        return this.validateComputedField(fieldPath, schema);
      default:
        return {
          isValid: true,
          errors: [],
          warnings: [],
          fieldPath,
        };
    }
  }

  private validateArrayField(fieldPath: string, schema: ArrayFieldSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!schema.items) {
      errors.push(`Array field '${fieldPath}' must have an 'items' property`);
    } else {
      if (Array.isArray(schema.items)) {
        // Tuple validation
        schema.items.forEach((item, index) => {
          const itemValidation = this.validateFieldSchema(`${fieldPath}[${index}]`, item);
          errors.push(...itemValidation.errors);
          warnings.push(...itemValidation.warnings);
        });
      } else {
        // Single item type validation
        const itemValidation = this.validateFieldSchema(`${fieldPath}[]`, schema.items);
        errors.push(...itemValidation.errors);
        warnings.push(...itemValidation.warnings);

        // Recursive validation for nested types
        if (schema.items.type === FieldType.OBJECT && schema.items.properties) {
          const nestedValidation = this.validateObjectField(`${fieldPath}[]`, schema.items);
          errors.push(...nestedValidation.errors);
          warnings.push(...nestedValidation.warnings);
        } else if (schema.items.type === FieldType.ARRAY && schema.items.items) {
          const nestedValidation = this.validateArrayField(`${fieldPath}[]`, schema.items);
          errors.push(...nestedValidation.errors);
          warnings.push(...nestedValidation.warnings);
        }
      }
    }

    // Array-specific constraints
    if (schema.minItems !== undefined && schema.maxItems !== undefined && schema.minItems > schema.maxItems) {
      errors.push(`Array field '${fieldPath}' minItems (${schema.minItems}) cannot be greater than maxItems (${schema.maxItems})`);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private validateObjectField(fieldPath: string, schema: ObjectFieldSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!schema.properties || typeof schema.properties !== 'object') {
      errors.push(`Object field '${fieldPath}' must have a valid 'properties' object`);
    } else {
      // Validate nested properties
      const nestedValidation = this.validateSchemaObject(schema.properties, fieldPath);
      errors.push(...nestedValidation.errors);
      warnings.push(...nestedValidation.warnings);

      // Validate required fields exist in properties
      if (schema.required) {
        for (const requiredField of schema.required) {
          if (!schema.properties[requiredField]) {
            errors.push(`Required field '${requiredField}' is not defined in properties of object '${fieldPath}'`);
          }
        }
      }
    }

    // Object-specific constraints
    if (schema.minProperties !== undefined && schema.maxProperties !== undefined && schema.minProperties > schema.maxProperties) {
      errors.push(`Object field '${fieldPath}' minProperties (${schema.minProperties}) cannot be greater than maxProperties (${schema.maxProperties})`);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private validateStringField(fieldPath: string, schema: StringFieldSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Length constraints
    if (schema.minLength !== undefined && schema.maxLength !== undefined && schema.minLength > schema.maxLength) {
      errors.push(`String field '${fieldPath}' minLength (${schema.minLength}) cannot be greater than maxLength (${schema.maxLength})`);
    }

    // Pattern validation
    if (schema.pattern) {
      try {
        new RegExp(schema.pattern);
      } catch (e) {
        errors.push(`String field '${fieldPath}' has invalid regex pattern: ${schema.pattern}`);
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private validateNumberField(fieldPath: string, schema: NumberFieldSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Range constraints
    if (schema.min !== undefined && schema.max !== undefined && schema.min > schema.max) {
      errors.push(`Number field '${fieldPath}' min (${schema.min}) cannot be greater than max (${schema.max})`);
    }

    // Conflicting constraints
    if (schema.positive && schema.negative) {
      errors.push(`Number field '${fieldPath}' cannot be both positive and negative`);
    }

    if (schema.positive && schema.max !== undefined && schema.max <= 0) {
      errors.push(`Number field '${fieldPath}' is marked as positive but has max value <= 0`);
    }

    if (schema.negative && schema.min !== undefined && schema.min >= 0) {
      errors.push(`Number field '${fieldPath}' is marked as negative but has min value >= 0`);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private validateEnumField(fieldPath: string, schema: EnumFieldSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!schema.values || schema.values.length === 0) {
      errors.push(`Enum field '${fieldPath}' must have at least one value defined`);
    }
    if (schema.values && schema.values.length > 0) {
      const valueSet = new Set();
      for (const value of schema.values) {
        if (typeof value === 'object' && 'value' in value) {
          if (valueSet.has(value.value)) {
            errors.push(`Enum field '${fieldPath}' has duplicate value: ${value.value}`);
          } else {
            valueSet.add(value.value);
          }
        } else {
          if (valueSet.has(value)) {
            errors.push(`Enum field '${fieldPath}' has duplicate value: ${value}`);
          } else {
            valueSet.add(value);
          }
        }
      }
      if (schema.default !== undefined && !valueSet.has(schema.default)) {
        errors.push(`Default value '${schema.default}' for enum field '${fieldPath}' is not defined in values`);
      }
    }
    if (schema.strict && schema.values.some((v) => typeof v === 'object' && 'disabled' in v && v.disabled)) {
      warnings.push(`Enum field '${fieldPath}' has disabled options, which may affect strict validation`);
    }

    if (schema.caseSensitive === false) {
      const lowerCaseValues = new Set(
        schema.values.map((v) => {
          const value = typeof v === 'object' ? v.value : v;
          return typeof value === 'string' ? value.toLowerCase() : value;
        }),
      );
      if (lowerCaseValues.size !== schema.values.length) {
        errors.push(`Enum field '${fieldPath}' has case-insensitive duplicates`);
      }
    }

    if (schema.allowCustom && schema.values.some((v) => typeof v === 'object' && 'custom' in v && v.custom)) {
      warnings.push(`Enum field '${fieldPath}' allows custom values, which may lead to unexpected behavior`);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private validateBooleanField(fieldPath: string, schema: BooleanFieldSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (schema.trueValues && schema.falseValues) {
      const trueSet = new Set(schema.trueValues);
      const falseSet = new Set(schema.falseValues);

      if ([...trueSet].some((v) => falseSet.has(v))) {
        errors.push(`Boolean field '${fieldPath}' has conflicting true and false values`);
      }
    }

    if (schema.default !== undefined && typeof schema.default !== 'boolean') {
      errors.push(`Default value for boolean field '${fieldPath}' must be a boolean`);
    }

    if (schema.trueValues && schema.trueValues.length === 0) {
      warnings.push(`Boolean field '${fieldPath}' has no true values defined`);
    }

    if (schema.falseValues && schema.falseValues.length === 0) {
      warnings.push(`Boolean field '${fieldPath}' has no false values defined`);
    }

    if (schema.trueValues && schema.trueValues.some((v) => typeof v !== 'string' && typeof v !== 'number')) {
      errors.push(`Boolean field '${fieldPath}' trueValues must be strings or numbers`);
    }

    if (schema.falseValues && schema.falseValues.some((v) => typeof v !== 'string' && typeof v !== 'number')) {
      errors.push(`Boolean field '${fieldPath}' falseValues must be strings or numbers`);
    }
    if (schema.trueValues && schema.trueValues.length > 0 && schema.falseValues && schema.falseValues.length > 0) {
      const trueSet = new Set(schema.trueValues);
      const falseSet = new Set(schema.falseValues);
      if ([...trueSet].some((v) => falseSet.has(v))) {
        errors.push(`Boolean field '${fieldPath}' has conflicting true and false values`);
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private validateDateField(fieldPath: string, schema: DateFieldSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (schema.default && !(schema.default instanceof Date || typeof schema.default === 'string')) {
      errors.push(`Default value for date field '${fieldPath}' must be a Date object or a string`);
    }

    if (schema.format && !['iso', 'timestamp', 'unix', 'custom'].includes(schema.format)) {
      errors.push(`Invalid format '${schema.format}' for date field '${fieldPath}'`);
    }

    if (schema.customFormat && schema.format !== 'custom') {
      warnings.push(`Custom format defined for date field '${fieldPath}' but format is not set to 'custom'`);
    }

    if (schema.min && !(schema.min instanceof Date || typeof schema.min === 'string')) {
      errors.push(`Min value for date field '${fieldPath}' must be a Date object or a string`);
    }

    if (schema.max && !(schema.max instanceof Date || typeof schema.max === 'string')) {
      errors.push(`Max value for date field '${fieldPath}' must be a Date object or a string`);
    }

    if (schema.min && schema.max && new Date(schema.min) > new Date(schema.max)) {
      errors.push(`Min value for date field '${fieldPath}' cannot be greater than max value`);
    }

    if (schema.timezone && typeof schema.timezone !== 'string') {
      errors.push(`Timezone for date field '${fieldPath}' must be a string`);
    }

    if (schema.autoUpdate && !['onCreate', 'onUpdate', 'both'].includes(schema.autoUpdate)) {
      errors.push(`Invalid autoUpdate option '${schema.autoUpdate}' for date field '${fieldPath}'`);
    }

    if (schema.customFormat) {
      try {
        new RegExp(schema.customFormat);
      } catch (e) {
        errors.push(`Invalid custom format '${schema.customFormat}' for date field '${fieldPath}'`);
      }
    }

    return { isValid: errors.length === 0, errors, warnings, fieldPath };
  }

  private validateComputedField(fieldPath: string, schema: ComputedFieldSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!schema.expression) {
      errors.push(`Computed field '${fieldPath}' must have an 'expression' property`);
    }

    if (!Array.isArray(schema.dependencies) || schema.dependencies.length === 0) {
      errors.push(`Computed field '${fieldPath}' must have at least one 'dependencies' defined`);
    }

    if (schema.cached && typeof schema.cached !== 'boolean') {
      errors.push(`Computed field '${fieldPath}' 'cached' property must be a boolean`);
    }

    if (schema.cacheTtl && typeof schema.cacheTtl !== 'number') {
      errors.push(`Cache TTL for computed field '${fieldPath}' must be a number`);
    }

    if (schema.recompute && !['onChange', 'onAccess', 'scheduled'].includes(schema.recompute)) {
      errors.push(`Invalid recompute option '${schema.recompute}' for computed field '${fieldPath}'`);
    }

    if (schema.expression && typeof schema.expression !== 'string') {
      errors.push(`Expression for computed field '${fieldPath}' must be a string`);
    }

    if (schema.dependencies && schema.dependencies.some((dep) => typeof dep !== 'string')) {
      errors.push(`Dependencies for computed field '${fieldPath}' must be an array of strings`);
    }

    if (schema.cacheTtl && schema.cacheTtl <= 0) {
      errors.push(`Cache TTL for computed field '${fieldPath}' must be greater than 0`);
    }

    if (schema.recompute && schema.recompute === 'scheduled' && !schema.cacheTtl) {
      warnings.push(`Computed field '${fieldPath}' is set to recompute on schedule but no cache TTL is defined`);
    }

    // Additional validation for computed fields can be added here
    if (schema.dependencies && schema.dependencies.length > 0) {
      for (const dependency of schema.dependencies) {
        if (typeof dependency !== 'string') {
          errors.push(`Computed field '${fieldPath}' has invalid dependency: ${String(dependency)}`);
        }
      }
    }
    if (schema.expression && !/^(\w+|\d+|\s+|[+\-*/()])+$/.test(schema.expression)) {
      errors.push(`Computed field '${fieldPath}' has an invalid expression: ${schema.expression}`);
    }

    return { isValid: errors.length === 0, errors, warnings, fieldPath };
  }
}
