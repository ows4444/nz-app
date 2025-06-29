import { Injectable } from '@nestjs/common';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional } from 'class-validator';
import { BaseFieldProcessor } from '../../../core/abstractions/base-field-processor.abstract';
import { FieldType } from '../../../core/enums';
import { BooleanFieldSchema } from '../../../core/interfaces/schema';

@Injectable()
export class BooleanFieldProcessor extends BaseFieldProcessor<BooleanFieldSchema> {
  readonly supportedType = FieldType.BOOLEAN;

  canProcess(schema: any): schema is BooleanFieldSchema {
    return schema.type === FieldType.BOOLEAN;
  }

  generateValidationDecorators(schema: BooleanFieldSchema, isRequired: boolean, parentIsArray: boolean): PropertyDecorator[] {
    const decorators: PropertyDecorator[] = [];

    if (isRequired) {
      decorators.push(IsDefined(parentIsArray ? { each: true } : undefined));
    } else {
      decorators.push(IsOptional(parentIsArray ? { each: true } : undefined));
    }

    decorators.push(IsBoolean(parentIsArray ? { each: true } : undefined));

    return decorators;
  }

  generateTransformationDecorators(schema: BooleanFieldSchema): PropertyDecorator[] {
    const decorators: PropertyDecorator[] = [];

    // Type coercion
    decorators.push(
      Transform(({ value }) => {
        if (typeof value === 'string') {
          return value.toLowerCase() === 'true';
        }
        return Boolean(value);
      }),
    );

    if (schema.default !== undefined) {
      decorators.push(this.createDefaultValueTransform(schema.default));
    }

    return decorators;
  }

  generateSerializationDecorators(schema: BooleanFieldSchema, excludeAll: boolean): PropertyDecorator[] {
    const decorators: PropertyDecorator[] = [];

    if (excludeAll && schema.expose) {
      decorators.push(Expose());
    } else if (!excludeAll && schema.exclude) {
      decorators.push(Exclude());
    }

    return decorators;
  }
}
