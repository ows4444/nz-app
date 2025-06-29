import { Transform } from 'class-transformer';
import { ValidateIf } from 'class-validator';
import { FieldType } from '../enums';
import { FieldSchema } from '../interfaces/schema';

export abstract class BaseFieldProcessor<T extends FieldSchema = FieldSchema> {
  abstract readonly supportedType: FieldType;

  abstract canProcess(schema: FieldSchema): schema is T;

  abstract generateValidationDecorators(schema: T, isRequired: boolean, parentIsArray?: boolean): PropertyDecorator[];

  abstract generateTransformationDecorators(schema: T): PropertyDecorator[];

  abstract generateSerializationDecorators(schema: T, excludeAll: boolean): PropertyDecorator[];

  protected createDefaultValueTransform(defaultValue: unknown): PropertyDecorator {
    return Transform(({ value }) => (value === undefined ? defaultValue : value));
  }

  protected createNullableValidation(): PropertyDecorator[] {
    return [ValidateIf((_, val) => val !== null)];
  }
}
