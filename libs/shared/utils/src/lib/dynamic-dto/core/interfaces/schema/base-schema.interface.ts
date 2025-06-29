import { FieldType } from '../../enums';

export interface BaseFieldSchema {
  type: FieldType;
  default?: unknown;
  readonly?: boolean;
  description?: string;
  nullable?: boolean;
  expose?: boolean;
  exclude?: boolean;
  version?: string;
}

export interface ValidationConstraint {
  rule: string;
  message?: string;
  params?: Record<string, unknown>;
}

export interface TransformationRule {
  type: 'coerce' | 'sanitize' | 'normalize' | 'custom';
  params?: Record<string, unknown>;
  handler?: (value: unknown) => unknown;
}
