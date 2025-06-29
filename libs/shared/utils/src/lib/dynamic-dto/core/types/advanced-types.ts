export type ClassConstructor<T = object> = new (...args: any[]) => T;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ProcessingContext {
  schema: string;
  field?: string;
  path?: string;
  metadata?: Record<string, unknown>;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
