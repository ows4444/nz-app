import { AutoGenerationType, FieldType } from '../../enums';
import { BaseFieldSchema } from './base-schema.interface';

export interface StringFieldSchema extends BaseFieldSchema {
  type: FieldType.STRING;
  default?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: 'email' | 'url' | 'uuid' | 'date' | 'custom';
  autoGenerate?: {
    type: AutoGenerationType;
    generator?: () => string;
  };
}

export interface NumberFieldSchema extends BaseFieldSchema {
  type: FieldType.NUMBER;
  default?: number;
  min?: number;
  max?: number;
  precision?: number;
  multipleOf?: number;
}

export interface BooleanFieldSchema extends BaseFieldSchema {
  type: FieldType.BOOLEAN;
  default?: boolean;
}

export interface ArrayFieldSchema extends BaseFieldSchema {
  type: FieldType.ARRAY;
  items: FieldSchema;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

export interface ObjectFieldSchema extends BaseFieldSchema {
  type: FieldType.OBJECT;
  properties: Record<string, FieldSchema>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface DateFieldSchema extends BaseFieldSchema {
  type: FieldType.DATE;
  default?: Date | string;
  format?: 'iso' | 'timestamp' | 'custom';
  min?: Date | string;
  max?: Date | string;
}

export interface EnumFieldSchema extends BaseFieldSchema {
  type: FieldType.ENUM;
  values: string[] | number[];
  default?: string | number;
}

export type FieldSchema = StringFieldSchema | NumberFieldSchema | BooleanFieldSchema | ArrayFieldSchema | ObjectFieldSchema | DateFieldSchema | EnumFieldSchema;
