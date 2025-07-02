import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDateString, IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID, Length, Matches } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { BaseFieldProcessor } from '../../../core/abstractions/base-field-processor.abstract';
import { AutoGenerationType, FieldType, StringFormat } from '../../../core/enums';
import { FieldSchema, StringFieldSchema } from '../../../core/interfaces/schema';

@Injectable()
export class StringFieldProcessor extends BaseFieldProcessor<StringFieldSchema> {
  readonly supportedType = FieldType.STRING;

  canProcess(schema: FieldSchema): schema is StringFieldSchema {
    return schema.type === FieldType.STRING;
  }

  generateValidationDecorators(schema: StringFieldSchema, isRequired: boolean, parentIsArray: boolean): PropertyDecorator[] {
    const decorators: PropertyDecorator[] = [];

    // Required/Optional validation
    if (isRequired) {
      decorators.push(IsDefined(parentIsArray ? { each: true } : undefined));

      if (!schema.nullable) {
        decorators.push(IsNotEmpty(parentIsArray ? { each: true } : undefined));
      }
    } else {
      decorators.push(IsOptional(parentIsArray ? { each: true } : undefined));
    }

    // Type validation
    decorators.push(IsString(parentIsArray ? { each: true } : undefined));

    // Length validation
    if (schema.minLength !== undefined || schema.maxLength !== undefined) {
      const min = schema.minLength ?? 0;
      const max = schema.maxLength ?? Number.MAX_SAFE_INTEGER;
      decorators.push(Length(min, max, parentIsArray ? { each: true } : undefined));
    }

    // Pattern validation
    if (schema.pattern) {
      decorators.push(Matches(new RegExp(schema.pattern), parentIsArray ? { each: true } : undefined));
    }

    // Format validation
    switch (schema.format) {
      case StringFormat.EMAIL: {
        decorators.push(IsEmail({}, parentIsArray ? { each: true } : undefined));
        break;
      }
      case StringFormat.URL: {
        decorators.push(IsUrl({}, parentIsArray ? { each: true } : undefined));
        break;
      }
      case StringFormat.UUID: {
        decorators.push(IsUUID(undefined, parentIsArray ? { each: true } : undefined));
        break;
      }
      case StringFormat.DATE: {
        decorators.push(IsDateString({}, parentIsArray ? { each: true } : undefined));
        break;
      }
      // Add more formats as needed TODO: Handle more formats
    }

    return decorators;
  }

  generateTransformationDecorators(schema: StringFieldSchema): PropertyDecorator[] {
    const decorators: PropertyDecorator[] = [];

    // Auto-generate transformation
    if (schema.autoGenerate) {
      decorators.push(this.createAutoGenerateTransform(schema.autoGenerate));
    } else if (schema.default !== undefined) {
      decorators.push(this.createDefaultValueTransform(schema));
    }

    return decorators;
  }

  private createAutoGenerateTransform(autoGenerate: StringFieldSchema['autoGenerate']): PropertyDecorator {
    return Transform(({ value }): string => {
      if (value === undefined && autoGenerate) {
        switch (autoGenerate) {
          case AutoGenerationType.UUID:
            return uuidv4();
          case AutoGenerationType.TIMESTAMP:
            return new Date().toISOString();
          default:
            return value;
        }
      }
      return value;
    });
  }
}
