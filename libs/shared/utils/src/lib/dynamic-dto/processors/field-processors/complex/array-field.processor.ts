import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDefined, IsOptional, ValidateNested } from 'class-validator';

import 'reflect-metadata';

import { BaseFieldProcessor } from '../../../core/abstractions/base-field-processor.abstract';
import { FieldType } from '../../../core/enums';
import { ArrayFieldSchema } from '../../../core/interfaces/schema';
import { FieldProcessorRegistry } from '../field-processor.registry';

@Injectable()
export class ArrayFieldProcessor extends BaseFieldProcessor<ArrayFieldSchema> {
  readonly supportedType = FieldType.ARRAY;

  constructor(@Inject(forwardRef(() => FieldProcessorRegistry)) private readonly processorRegistry: FieldProcessorRegistry) {
    super();
  }

  canProcess(schema: any): schema is ArrayFieldSchema {
    return schema.type === FieldType.ARRAY;
  }

  generateValidationDecorators(schema: ArrayFieldSchema, isRequired: boolean): PropertyDecorator[] {
    const decorators: PropertyDecorator[] = [];

    // Required/Optional validation
    if (isRequired) {
      decorators.push(IsDefined());
    } else {
      decorators.push(IsOptional());
    }

    // Array validation
    decorators.push(IsArray());

    // Size validation
    if (schema.minItems !== undefined) {
      decorators.push(ArrayMinSize(schema.minItems));
    }
    if (schema.maxItems !== undefined) {
      decorators.push(ArrayMaxSize(schema.maxItems));
    }

    // Item validation
    if (!Array.isArray(schema.items) && schema.items.type === FieldType.OBJECT) {
      decorators.push(ValidateNested({ each: true }));
    } else if (!Array.isArray(schema.items)) {
      const itemProcessor = this.processorRegistry.getProcessor(schema.items.type);
      const itemDecorators = itemProcessor.generateValidationDecorators(schema.items, true, true);
      // Apply each: true to item decorators
      decorators.push(...itemDecorators); //.map((decorator) => this.makeEachDecorator(decorator)));
    }
    // If schema.items is an array, handle accordingly if needed
    else if (Array.isArray(schema.items)) {
      // This case is not handled in the original code, but we can add a check if needed
      // For now, we'll skip this complex case
    }

    return decorators;
  }

  generateTransformationDecorators(schema: ArrayFieldSchema): PropertyDecorator[] {
    const decorators: PropertyDecorator[] = [];

    if (schema.default !== undefined) {
      decorators.push(this.createDefaultValueTransform(schema));
    }
    // Nested object transformation
    if (!Array.isArray(schema.items) && schema.items.type === FieldType.OBJECT) {
      // This would need to be implemented with nested class generation
      // For now, we'll skip this complex case
    }

    return decorators;
  }
}
