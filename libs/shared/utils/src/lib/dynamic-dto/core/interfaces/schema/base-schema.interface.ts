import { FieldType, ValidationStrategy } from '../../enums';

export interface BaseFieldSchema {
  type: FieldType;
  default?: unknown;
  readonly?: boolean;
  description?: string;
  nullable?: boolean;
  expose?: boolean;
  exclude?: boolean;
  version?: string;

  metadata?: Record<string, unknown>;
  tags?: string[];
  category?: string;
  deprecated?: boolean;
  deprecatedSince?: string;
  replacedBy?: string;

  // Validation options
  validationStrategy?: ValidationStrategy;
  customValidators?: string[]; // Serializable validator identifiers
  conditionalValidation?: ConditionalValidation[];

  // UI/Display hints (serializable)
  displayHints?: DisplayHints;

  // Access control
  permissions?: FieldPermissions;

  // Lifecycle hooks (serializable as function names/identifiers)
  hooks?: FieldHooks;

  // Indexing and performance
  indexed?: boolean;
  unique?: boolean;
  sparse?: boolean;

  // Internationalization
  i18n?: I18nConfig;
}

// Conditional validation interface
export interface ConditionalValidation {
  condition: SerializableCondition;
  validationRules: ValidationRule[];
  errorMessage?: string;
}
export interface SerializableCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'exists' | 'regex';
  value?: unknown;
  logicalOperator?: 'and' | 'or';
  nested?: SerializableCondition[];
}
export interface ValidationRule {
  type: string;
  params?: Record<string, unknown>;
  message?: string;
}

// Display hints for UI generation
export interface DisplayHints {
  label?: string;
  placeholder?: string;
  helpText?: string;
  widget?: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'color' | 'range' | 'custom';
  widgetProps?: Record<string, unknown>;
  group?: string;
  order?: number;
  hidden?: boolean;
  collapsible?: boolean;
  validation?: {
    showInline?: boolean;
    showSummary?: boolean;
  };
}

// Permission system
export interface FieldPermissions {
  read?: string[]; // Role names
  write?: string[]; // Role names
  create?: string[]; // Role names
  update?: string[]; // Role names
  delete?: string[]; // Role names
}

// Lifecycle hooks (serializable)
export interface FieldHooks {
  beforeValidation?: string; // Function identifier
  afterValidation?: string;
  beforeTransform?: string;
  afterTransform?: string;
  beforeSave?: string;
  afterSave?: string;
}

// Internationalization config
export interface I18nConfig {
  translatable?: boolean;
  locales?: string[];
  fallbackLocale?: string;
  translationKey?: string;
}

export interface ValidationConstraint {
  rule: string;
  message?: string;
  params?: Record<string, unknown>;
}
