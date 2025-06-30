import { ValidationConstraint } from './base-schema.interface';

export interface ValidationSchema {
  constraints: ValidationConstraint[];
  crossFieldRules?: CrossFieldValidationRule[];
  businessRules?: any[];
}

export interface CrossFieldValidationRule {
  fields: string[];
  rule: string;
  message?: string;
  validator: (values: Record<string, unknown>) => boolean;
}
