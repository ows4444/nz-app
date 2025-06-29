import { Injectable } from '@nestjs/common';
import { Exclude } from 'class-transformer';

import 'reflect-metadata';

import { ClassConstructor } from '../../core/types';
import { DynamicSchemaEntity } from '../../domain/entities/dynamic-schema.entity';
import { FieldProcessorRegistry } from '../../processors/field-processors/field-processor.registry';

@Injectable()
export class DtoGenerationPipeline {
  constructor(private readonly fieldProcessorRegistry: FieldProcessorRegistry) {}

  generate(schema: DynamicSchemaEntity): ClassConstructor<object> {
    const className = this.generateClassName(schema.name, schema.version.toString());

    const DynamicClass = this.createBaseClass(className, schema);

    // Process each field
    for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
      const processor = this.fieldProcessorRegistry.getProcessor(fieldSchema.type);
      const isRequired = schema.getRequiredFields().includes(fieldName);

      const decorators = [
        ...processor.generateValidationDecorators(fieldSchema, isRequired, false),
        ...processor.generateTransformationDecorators(fieldSchema),
        ...processor.generateSerializationDecorators(fieldSchema, schema.excludeAll),
      ];

      this.applyDecorators(DynamicClass, fieldName, decorators);
    }

    // Apply class-level decorators
    if (schema.excludeAll) {
      Exclude()(DynamicClass);
    }

    return DynamicClass;
  }

  private createBaseClass(className: string, schema: DynamicSchemaEntity): ClassConstructor<object> {
    const DynamicClass = function (this: Record<string, unknown>) {
      for (const propName of Object.keys(schema.properties)) {
        this[propName] = undefined;
      }
    } as unknown as ClassConstructor<object>;

    Object.defineProperty(DynamicClass, 'name', { value: className });
    return DynamicClass;
  }

  private generateClassName(name: string, version: string): string {
    return `${name}_v${version.replace(/\./g, '_')}`;
  }

  private applyDecorators(targetClass: ClassConstructor<object>, propertyName: string, decorators: PropertyDecorator[]): void {
    decorators.forEach((decorator) => {
      if (typeof decorator === 'function') {
        decorator(targetClass.prototype, propertyName);
      }
    });
  }
}
