import { Exclude, Expose, Transform } from 'class-transformer';
import { ValidateIf } from 'class-validator';
import { FieldType } from '../enums';
import { FieldSchema } from '../interfaces/schema';

export abstract class BaseFieldProcessor<T extends FieldSchema = FieldSchema> {
  abstract readonly supportedType: FieldType;

  abstract canProcess(schema: FieldSchema): schema is T;

  abstract generateValidationDecorators(schema: T, isRequired: boolean, parentIsArray?: boolean): PropertyDecorator[];

  abstract generateTransformationDecorators(schema: T): PropertyDecorator[];

  public generateSerializationDecorators(schema: T, isRequired: boolean, excludeAll: boolean): PropertyDecorator[] {
    const decorators: PropertyDecorator[] = [];

    const shouldExpose = (excludeAll && schema.expose) || isRequired;
    const shouldExclude = !excludeAll && schema.exclude;

    if (shouldExpose) {
      decorators.push(Expose());
    }

    if (shouldExclude) {
      decorators.push(Exclude());
    }

    return decorators;
  }

  protected createDefaultValueTransform(defaultValue: unknown): PropertyDecorator {
    return Transform(({ value }) => (value === undefined ? defaultValue : value));
  }

  protected createNullableValidation(): PropertyDecorator[] {
    return [ValidateIf((_, val) => val !== null)];
  }
}
