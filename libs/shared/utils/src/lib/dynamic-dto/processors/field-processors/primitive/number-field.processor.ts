import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDefined, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { BaseFieldProcessor } from '../../../core/abstractions/base-field-processor.abstract';
import { FieldType } from '../../../core/enums';
import { FieldSchema, NumberFieldSchema } from '../../../core/interfaces/schema';

@Injectable()
export class NumberFieldProcessor extends BaseFieldProcessor<NumberFieldSchema> {
  readonly supportedType = FieldType.NUMBER;

  canProcess(schema: FieldSchema): schema is NumberFieldSchema {
    return schema.type === FieldType.NUMBER;
  }

  generateValidationDecorators(schema: NumberFieldSchema, isRequired: boolean, parentIsArray: boolean): PropertyDecorator[] {
    const decorators: PropertyDecorator[] = [];

    if (isRequired) {
      decorators.push(IsDefined(parentIsArray ? { each: true } : undefined));
    } else {
      decorators.push(IsOptional(parentIsArray ? { each: true } : undefined));
    }

    decorators.push(IsNumber({}, parentIsArray ? { each: true } : undefined));

    if (schema.min !== undefined) {
      decorators.push(Min(schema.min, parentIsArray ? { each: true } : undefined));
    }
    if (schema.max !== undefined) {
      decorators.push(Max(schema.max, parentIsArray ? { each: true } : undefined));
    }

    return decorators;
  }

  generateTransformationDecorators(schema: NumberFieldSchema): PropertyDecorator[] {
    const decorators: PropertyDecorator[] = [];

    // Type coercion
    decorators.push(
      Transform(({ value }): any => {
        if (typeof value === 'string') {
          const num = Number(value);
          return isNaN(num) ? value : num;
        }
        return value;
      }),
    );

    if (schema.default !== undefined) {
      decorators.push(this.createDefaultValueTransform(schema));
    }

    return decorators;
  }
}
