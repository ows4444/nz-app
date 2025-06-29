import { ValidationConstraint } from './base-schema.interface';

export interface ValidationSchema {
  constraints: ValidationConstraint[];
  crossFieldRules?: CrossFieldValidationRule[];
  businessRules?: BusinessRule[];
}

export interface CrossFieldValidationRule {
  fields: string[];
  rule: string;
  message?: string;
  validator: (values: Record<string, unknown>) => boolean;
}

export interface BusinessRule {
  id: string;
  description: string;
  validator: (data: unknown) => Promise<boolean> | boolean;
  message?: string;
}
