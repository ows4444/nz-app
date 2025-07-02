import { FieldSchema } from 'src/dynamic-dto/core/interfaces/schema';
import { StructuralSchemaValidator } from './structural-schema.validator';
import { Test } from '@nestjs/testing';
import { FieldType } from '../../core/enums';

describe('StructuralSchemaValidator', () => {
  let validator: StructuralSchemaValidator;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [StructuralSchemaValidator],
    }).compile();

    validator = moduleRef.get<StructuralSchemaValidator>(StructuralSchemaValidator);
  });

  it('should validate a simple schema with no errors', () => {
    const schema = {
      name: { type: 'string' },
    } as Record<string, unknown> as Record<string, FieldSchema>;

    const result = validator.validate(schema);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('should return errors for missing type in field schema', () => {
    const schema = {
      name: {},
    } as Record<string, unknown> as Record<string, FieldSchema>;

    const result = validator.validate(schema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Field 'name' is missing required 'type' property");
    expect(result.warnings).toEqual([]);
  });

  it('should return errors for invalid field type', () => {
    const schema = {
      name: { type: 'invalid_type' },
    } as Record<string, unknown> as Record<string, FieldSchema>;

    const result = validator.validate(schema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Field 'name' has an invalid 'type' property: invalid_type");
    expect(result.warnings).toEqual([]);
  });

  it('should validate array fields with items', () => {
    const schema = {
      tags: { type: FieldType.ARRAY, items: { type: 'string' } },
    } as Record<string, unknown> as Record<string, FieldSchema>;

    const result = validator.validate(schema);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('should return errors for array fields without items', () => {
    const schema = {
      tags: { type: FieldType.ARRAY },
    } as Record<string, unknown> as Record<string, FieldSchema>;

    const result = validator.validate(schema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Array field 'tags' must have an 'items' property");
    expect(result.warnings).toEqual([]);
  });

  it('should validate object fields with properties', () => {
    const schema = {
      user: {
        type: FieldType.OBJECT,
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
      },
    } as Record<string, unknown> as Record<string, FieldSchema>;

    const result = validator.validate(schema);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('should return errors for object fields without properties', () => {
    const schema = {
      user: { type: FieldType.OBJECT },
    } as Record<string, unknown> as Record<string, FieldSchema>;

    const result = validator.validate(schema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Object field 'user' must have a 'properties' property");
    expect(result.warnings).toEqual([]);
  });

  it('should return errors for object fields with non-object properties', () => {
    const schema = {
      user: { type: FieldType.OBJECT, properties: 'not_an_object' },
    } as Record<string, unknown> as Record<string, FieldSchema>;

    const result = validator.validate(schema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Object field 'user' properties must be an object");
    expect(result.warnings).toEqual([]);
  });

  it('should validate complex schemas with multiple fields', () => {
    const schema = {
      name: { type: 'string' },
      age: { type: 'number' },
      tags: { type: FieldType.ARRAY, items: { type: 'string' } },
      address: {
        type: FieldType.OBJECT,
        properties: {
          street: { type: 'string' },
          city: { type: 'string' },
        },
      },
    } as Record<string, unknown> as Record<string, FieldSchema>;

    const result = validator.validate(schema);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('should return errors for complex schemas with multiple issues', () => {
    const schema = {
      name: {},
      age: { type: 'invalid_type' },
      tags: { type: FieldType.ARRAY },
      address: {
        type: FieldType.OBJECT,
        properties: 'not_an_object',
      },
      address2: {
        type: FieldType.OBJECT,
      },
      nested: {
        type: FieldType.OBJECT,
        properties: {
          nestedField: { type: 'string' },
          xxyy: { type: 'number' },
          nestedArray: { type: FieldType.ARRAY, items: { type: 'string' } },
          nestedObject: {
            type: FieldType.OBJECT,
            properties: {
              innerField: { type: 'string' },
            },
          },
        },
      },
    } as Record<string, unknown> as Record<string, FieldSchema>;

    const result = validator.validate(schema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toBe(true);
    expect(result.errors).toContain("Field 'name' is missing required 'type' property");
    expect(result.errors).toContain("Field 'age' has an invalid 'type' property: invalid_type");
    expect(result.errors).toContain("Array field 'tags' must have an 'items' property");
    expect(result.errors).toContain("Object field 'address' properties must be an object");
    expect(result.errors).toContain("Object field 'address2' must have a 'properties' property");
    expect(result.errors.length).toBe(5);
    expect(result.warnings).toEqual([]);
  });
});
