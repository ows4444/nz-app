import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDefined, IsObject, IsOptional, ValidateNested } from 'class-validator';

import 'reflect-metadata';

import { DtoGenerationPipeline } from '../../../application/pipelines/dto-generation.pipeline';
import { BaseFieldProcessor } from '../../../core/abstractions/base-field-processor.abstract';
import { FieldType } from '../../../core/enums';
import { ObjectFieldSchema } from '../../../core/interfaces/schema';
import { DynamicSchemaEntity } from '../../../domain/entities/dynamic-schema.entity';
import { SchemaVersion } from '../../../domain/value-objects/schema-version.vo';

@Injectable()
export class ObjectFieldProcessor extends BaseFieldProcessor<ObjectFieldSchema> {
  readonly supportedType = FieldType.OBJECT;
  private classCounter = 0;

  constructor(@Inject(forwardRef(() => DtoGenerationPipeline)) private readonly generationPipeline: DtoGenerationPipeline) {
    super();
  }

  canProcess(schema: any): schema is ObjectFieldSchema {
    return schema.type === FieldType.OBJECT;
  }

  generateValidationDecorators(schema: ObjectFieldSchema, isRequired: boolean, parentIsArray: boolean): PropertyDecorator[] {
    const decorators: PropertyDecorator[] = [];

    if (isRequired) {
      decorators.push(IsDefined(parentIsArray ? { each: true } : undefined));
    } else {
      decorators.push(IsOptional(parentIsArray ? { each: true } : undefined));
    }

    decorators.push(IsObject(parentIsArray ? { each: true } : undefined));

    decorators.push(ValidateNested(parentIsArray ? { each: true } : undefined));

    return decorators;
  }

  generateTransformationDecorators(schema: ObjectFieldSchema): PropertyDecorator[] {
    const decorators: PropertyDecorator[] = [];

    if (schema.properties) {
      const nestedSchema = new DynamicSchemaEntity(
        this.generateUniqueId(),
        this.generateUniqueClassName(),
        schema.properties,
        SchemaVersion.fromString('1.0.0'),
        schema.required || [],
        schema.exclude || false,
      );

      const nestedClass = this.generationPipeline.generate(nestedSchema);
      decorators.push(Type(() => nestedClass));
    }

    if (schema.default !== undefined) {
      decorators.push(this.createDefaultValueTransform(schema));
    }

    return decorators;
  }

  private generateUniqueClassName(): string {
    return `DynamicNested${++this.classCounter}`;
  }

  private generateUniqueId(): string {
    return `nested-${this.classCounter}-${Date.now()}`;
  }
}
