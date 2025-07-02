import { AutoGenerationType, CacheStrategy, CaseTransform, CharacterSet, FieldType, StringFormat, WhitespaceType } from '../../enums';
import { AutoGenerateConfig } from '../config/auto-generate-config.interface';
import { DiscriminatorConfig } from '../config/discriminator-config.interface';
import { ImageConfig } from '../config/image-config.interface';
import { InheritanceConfig } from '../config/inheritance-config.interface';
import { SanitizationConfig } from '../config/sanitization-config.interface';
import { BaseFieldSchema, ValidationRule } from './base-schema.interface';

export interface StringFieldSchema extends BaseFieldSchema {
  type: FieldType.STRING;

  default?: string | StringDefaultValue;

  minLength?: number;
  maxLength?: number;
  exactLength?: number;

  pattern?: string;
  patterns?: PatternRule[]; // Multiple patterns with different contexts
  antiPattern?: string | RegExp; // Patterns that should NOT match

  format?: StringFormat;
  customFormat?: CustomFormatConfig;
  formatOptions?: FormatOptions;

  autoGenerate?: AutoGenerationType;
  autoGenerateConfig?: AutoGenerateConfig;

  // Case transformations
  case?: CaseTransform;
  preserveCase?: boolean; // Don't transform case during processing

  // Text transformations
  trim?: boolean | TrimOptions;
  normalize?: boolean | NormalizeOptions;
  encoding?: EncodingOptions;

  sanitization?: SanitizationConfig;

  contentRules?: ContentRule[];

  // String boundaries and affixes
  prefix?: string | PrefixConfig;
  suffix?: string | SuffixConfig;
  startsWith?: string | string[];
  endsWith?: string | string[];
  contains?: string | string[];
  doesNotContain?: string | string[];

  // Character restrictions
  allowedChars?: string | CharacterSet;
  forbiddenChars?: string | CharacterSet;
  charset?: CharsetValidation;

  // Whitespace handling
  whitespace?: WhitespaceRule;
  lineBreaks?: LineBreakRule;

  // Internationalization
  locale?: string | string[];
  collation?: CollationRule;
  direction?: 'ltr' | 'rtl' | 'auto';

  // Advanced parsing
  parse?: ParseConfig;
  extract?: ExtractionRule[];

  // Masks and formatting
  mask?: string | MaskConfig;
  displayFormat?: string;
  inputFormat?: string;

  // Validation context
  contextValidation?: ContextValidationRule[];
  businessRules?: BusinessRule[];

  // Performance and indexing
  searchable?: boolean | SearchConfig;
  indexing?: IndexingConfig;

  // Security
  security?: SecurityConfig;

  // Multi-value support
  multiValue?: MultiValueConfig;

  // Placeholder and hints
  placeholder?: string;
  examples?: string[];
  hints?: string[];
}

export interface NumberFieldSchema extends BaseFieldSchema {
  type: FieldType.NUMBER;
  default?: number;
  min?: number;
  max?: number;
  precision?: number;
  multipleOf?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
  finite?: boolean;
  format?: 'float' | 'double' | 'int32' | 'int64' | 'decimal';
  unit?: string;
}

export interface BooleanFieldSchema extends BaseFieldSchema {
  type: FieldType.BOOLEAN;
  default?: boolean;
  trueValues?: (string | number)[];
  falseValues?: (string | number)[];
}

export interface ArrayFieldSchema extends BaseFieldSchema {
  type: FieldType.ARRAY;
  items: FieldSchema | FieldSchema[];
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  sortable?: boolean;
  sortBy?: string;
  allowDuplicates?: boolean;
  itemValidation?: ValidationRule[];
}

export interface ObjectFieldSchema extends BaseFieldSchema {
  type: FieldType.OBJECT;
  properties: Record<string, FieldSchema>;
  minProperties?: number;
  maxProperties?: number;
  required?: string[];
  additionalProperties?: boolean;
  patternProperties?: Record<string, FieldSchema>;
  dependencies?: Record<string, string[] | FieldSchema>;
  discriminator?: DiscriminatorConfig;
  inheritance?: InheritanceConfig;
}

export interface DateFieldSchema extends BaseFieldSchema {
  type: FieldType.DATE;
  default?: Date | string;
  format?: 'iso' | 'timestamp' | 'unix' | 'custom';
  customFormat?: string;
  min?: Date | string;
  max?: Date | string;
  timezone?: string;
  autoUpdate?: 'onCreate' | 'onUpdate' | 'both';
}

export interface EnumOption {
  value: string | number;
  label?: string;
  description?: string;
  disabled?: boolean;
  group?: string;
}

export interface EnumFieldSchema extends BaseFieldSchema {
  type: FieldType.ENUM;
  values: (string | number | EnumOption)[];
  default?: string | number;
  strict?: boolean;
  caseSensitive?: boolean;
  allowCustom?: boolean;
}

// New field types
export interface FileFieldSchema extends BaseFieldSchema {
  type: FieldType.FILE;
  allowedTypes?: string[]; // MIME types
  maxSize?: number; // in bytes
  multiple?: boolean;
  storageProvider?: string;
  storageConfig?: Record<string, unknown>;
  imageConfig?: ImageConfig;
}

export interface JsonFieldSchema extends BaseFieldSchema {
  type: FieldType.JSON;
  schema?: FieldSchema; // JSON Schema validation
  minProperties?: number;
  maxProperties?: number;
  allowedKeys?: string[];
  forbiddenKeys?: string[];
}

export interface ReferenceFieldSchema extends BaseFieldSchema {
  type: FieldType.REFERENCE;
  referenceTo: string; // Collection/table name
  cascadeDelete?: boolean;
  populate?: boolean | string[]; // Fields to populate
  lazy?: boolean;
  multiple?: boolean;
  bidirectional?: boolean;
  foreignKey?: string;
}

export interface ComputedFieldSchema extends BaseFieldSchema {
  type: FieldType.COMPUTED;
  expression: string; // Serializable expression
  dependencies: string[]; // Field names this computed field depends on
  cached?: boolean;
  cacheStrategy?: CacheStrategy;
  cacheTtl?: number;
  recompute?: 'onChange' | 'onAccess' | 'scheduled';
}

export interface UnionFieldSchema extends BaseFieldSchema {
  type: FieldType.UNION;
  schemas: FieldSchema[];
  discriminator?: string;
  strict?: boolean;
}

export interface TupleFieldSchema extends BaseFieldSchema {
  type: FieldType.TUPLE;
  items: FieldSchema[];
  additionalItems?: boolean | FieldSchema;
}

export interface MapFieldSchema extends BaseFieldSchema {
  type: FieldType.MAP;
  keySchema: StringFieldSchema | NumberFieldSchema;
  valueSchema: FieldSchema;
  minEntries?: number;
  maxEntries?: number;
}

export interface SetFieldSchema extends BaseFieldSchema {
  type: FieldType.SET;
  itemSchema: FieldSchema;
  minItems?: number;
  maxItems?: number;
}

export type FieldSchema =
  | StringFieldSchema
  | NumberFieldSchema
  | BooleanFieldSchema
  | ArrayFieldSchema
  | ObjectFieldSchema
  | DateFieldSchema
  | EnumFieldSchema
  | FileFieldSchema
  | JsonFieldSchema
  | ReferenceFieldSchema
  | ComputedFieldSchema
  | UnionFieldSchema
  | TupleFieldSchema
  | MapFieldSchema
  | SetFieldSchema;

export interface PatternRule {
  pattern: string | RegExp;
  flags?: string;
  message?: string;
  context?: string;
  priority?: number;
  caseSensitive?: boolean;
  multiline?: boolean;
  global?: boolean;
}

export interface FormatOptions {
  strict?: boolean;
  allowPartial?: boolean;
  normalizeFormat?: boolean;
  locale?: string;
  dateFormat?: string;
  timeFormat?: string;
  phoneFormat?: 'international' | 'national' | 'e164' | 'rfc3966';
  urlProtocol?: 'required' | 'optional' | 'auto';
  emailValidation?: 'basic' | 'strict' | 'mx' | 'disposable';
  currencyCode?: string;
  currencySymbol?: string;
}

export interface CustomFormatConfig {
  validator: string; // Function identifier for custom validation
  formatter?: string; // Function identifier for custom formatting
  parser?: string; // Function identifier for custom parsing
  examples?: string[];
  description?: string;
}

export interface FormatOptions {
  strict?: boolean;
  allowPartial?: boolean;
  normalizeFormat?: boolean;
  locale?: string;
  dateFormat?: string;
  timeFormat?: string;
  phoneFormat?: 'international' | 'national' | 'e164' | 'rfc3966';
  urlProtocol?: 'required' | 'optional' | 'auto';
  emailValidation?: 'basic' | 'strict' | 'mx' | 'disposable';
  currencyCode?: string;
  currencySymbol?: string;
}

export interface TrimOptions {
  start?: boolean;
  end?: boolean;
  inner?: boolean; // Trim inner whitespace
  chars?: string; // Custom characters to trim
  preserve?: string[]; // Characters to preserve
}

export interface NormalizeOptions {
  form?: 'NFC' | 'NFD' | 'NFKC' | 'NFKD';
  caseFold?: boolean;
  stripAccents?: boolean;
  stripPunctuation?: boolean;
  compactWhitespace?: boolean;
  removeEmptyLines?: boolean;
}

export interface EncodingOptions {
  input?: 'utf8' | 'ascii' | 'latin1' | 'base64' | 'hex' | 'binary';
  output?: 'utf8' | 'ascii' | 'latin1' | 'base64' | 'hex' | 'binary';
  strict?: boolean;
  errorHandling?: 'throw' | 'ignore' | 'replace';
  replacementChar?: string;
}

// Supporting interfaces
export interface StringDefaultValue {
  type: 'static' | 'dynamic' | 'computed' | 'template';
  value?: string;
  template?: string;
  expression?: string;
  context?: string[];
}

export interface ContentRule {
  type: 'profanity' | 'spam' | 'adult' | 'violence' | 'custom';
  action: 'block' | 'warn' | 'filter' | 'replace';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  replacement?: string;
  customRules?: string[];
  whitelist?: string[];
  blacklist?: string[];
}

export interface PrefixConfig {
  value: string;
  required?: boolean;
  caseSensitive?: boolean;
  autoAdd?: boolean;
  separator?: string;
}

export interface SuffixConfig {
  value: string;
  required?: boolean;
  caseSensitive?: boolean;
  autoAdd?: boolean;
  separator?: string;
}

export interface MultiValueConfig {
  separator?: string | RegExp;
  minValues?: number;
  maxValues?: number;
  uniqueValues?: boolean;
  sorted?: boolean;
  trimValues?: boolean;
  filterEmpty?: boolean;
}

// Supporting interfaces
export interface StringDefaultValue {
  type: 'static' | 'dynamic' | 'computed' | 'template';
  value?: string;
  template?: string;
  expression?: string;
  context?: string[];
}

export interface PatternRule {
  pattern: string | RegExp;
  flags?: string;
  message?: string;
  context?: string;
  priority?: number;
  caseSensitive?: boolean;
  multiline?: boolean;
  global?: boolean;
}

export interface CustomFormatConfig {
  validator: string; // Function identifier for custom validation
  formatter?: string; // Function identifier for custom formatting
  parser?: string; // Function identifier for custom parsing
  examples?: string[];
  description?: string;
}

export interface FormatOptions {
  strict?: boolean;
  allowPartial?: boolean;
  normalizeFormat?: boolean;
  locale?: string;
  dateFormat?: string;
  timeFormat?: string;
  phoneFormat?: 'international' | 'national' | 'e164' | 'rfc3966';
  urlProtocol?: 'required' | 'optional' | 'auto';
  emailValidation?: 'basic' | 'strict' | 'mx' | 'disposable';
  currencyCode?: string;
  currencySymbol?: string;
}

export interface TrimOptions {
  start?: boolean;
  end?: boolean;
  inner?: boolean; // Trim inner whitespace
  chars?: string; // Custom characters to trim
  preserve?: string[]; // Characters to preserve
}

export interface NormalizeOptions {
  form?: 'NFC' | 'NFD' | 'NFKC' | 'NFKD';
  caseFold?: boolean;
  stripAccents?: boolean;
  stripPunctuation?: boolean;
  compactWhitespace?: boolean;
  removeEmptyLines?: boolean;
}

export interface EncodingOptions {
  input?: 'utf8' | 'ascii' | 'latin1' | 'base64' | 'hex' | 'binary';
  output?: 'utf8' | 'ascii' | 'latin1' | 'base64' | 'hex' | 'binary';
  strict?: boolean;
  errorHandling?: 'throw' | 'ignore' | 'replace';
  replacementChar?: string;
}

export interface CustomSanitizer {
  name: string;
  pattern: string | RegExp;
  replacement: string;
  global?: boolean;
}

export interface ContentRule {
  type: 'profanity' | 'spam' | 'adult' | 'violence' | 'custom';
  action: 'block' | 'warn' | 'filter' | 'replace';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  replacement?: string;
  customRules?: string[];
  whitelist?: string[];
  blacklist?: string[];
}

export interface PrefixConfig {
  value: string;
  required?: boolean;
  caseSensitive?: boolean;
  autoAdd?: boolean;
  separator?: string;
}

export interface SuffixConfig {
  value: string;
  required?: boolean;
  caseSensitive?: boolean;
  autoAdd?: boolean;
  separator?: string;
}

export interface CharsetValidation {
  allowed: CharacterSet | string;
  forbidden?: CharacterSet | string;
  mixed?: boolean; // Allow mixed character sets
  ranges?: UnicodeRange[];
  categories?: UnicodeCategory[];
}

export interface UnicodeRange {
  start: number;
  end: number;
  name?: string;
}

export interface UnicodeCategory {
  category: string; // Unicode category like 'Lu', 'Ll', 'Nd', etc.
  allowed: boolean;
}

export interface WhitespaceRule {
  allow?: boolean;
  normalize?: boolean;
  preserve?: 'leading' | 'trailing' | 'inner' | 'all' | 'none';
  maxConsecutive?: number;
  types?: WhitespaceType[];
}

export interface LineBreakRule {
  allow?: boolean;
  normalize?: 'lf' | 'crlf' | 'cr' | 'auto';
  maxConsecutive?: number;
  preserveIndentation?: boolean;
}

export interface CollationRule {
  locale: string;
  sensitivity?: 'base' | 'accent' | 'case' | 'variant';
  numeric?: boolean;
  ignorePunctuation?: boolean;
}

export interface ParseConfig {
  type: 'json' | 'xml' | 'csv' | 'yaml' | 'ini' | 'query' | 'custom';
  options?: Record<string, unknown>;
  strict?: boolean;
  errorHandling?: 'throw' | 'ignore' | 'default';
  defaultValue?: unknown;
}

export interface ExtractionRule {
  name: string;
  pattern: string | RegExp;
  group?: number | string;
  transform?: string; // Function identifier
  required?: boolean;
  multiple?: boolean;
}

export interface MaskConfig {
  pattern: string;
  placeholder?: string;
  reverse?: boolean;
  clearIncomplete?: boolean;
  definitions?: Record<string, string | RegExp>;
}

export interface ContextValidationRule {
  context: string;
  rules: ValidationRule[];
  message?: string;
}

export interface BusinessRule {
  name: string;
  description?: string;
  condition: string; // Expression
  action: 'validate' | 'transform' | 'reject' | 'warn';
  message?: string;
  priority?: number;
}

export interface SearchConfig {
  indexed?: boolean;
  analyzer?: string;
  boost?: number;
  fuzziness?: number | 'auto';
  synonyms?: string[];
  stemming?: boolean;
  stopWords?: string[];
}

export interface IndexingConfig {
  type?: 'btree' | 'hash' | 'gin' | 'gist' | 'fulltext';
  unique?: boolean;
  sparse?: boolean;
  partial?: string;
  collation?: string;
  compression?: boolean;
}

export interface SecurityConfig {
  encryption?: EncryptionConfig;
  hashing?: HashingConfig;
  redaction?: RedactionConfig;
  audit?: boolean;
  pii?: boolean; // Personally Identifiable Information
  sensitive?: boolean;
}

export interface EncryptionConfig {
  algorithm?: 'aes-256-gcm' | 'aes-256-cbc' | 'chacha20-poly1305';
  keyId?: string;
  searchable?: boolean; // Searchable encryption
}

export interface HashingConfig {
  algorithm?: 'sha256' | 'sha512' | 'bcrypt' | 'argon2' | 'scrypt';
  salt?: boolean;
  rounds?: number;
  pepper?: boolean;
}

export interface RedactionConfig {
  mode?: 'mask' | 'hash' | 'remove' | 'tokenize';
  preserveLength?: boolean;
  maskChar?: string;
  preserveFormat?: boolean;
  exceptions?: string[]; // Parts not to redact
}

export interface MultiValueConfig {
  separator?: string | RegExp;
  minValues?: number;
  maxValues?: number;
  uniqueValues?: boolean;
  sorted?: boolean;
  trimValues?: boolean;
  filterEmpty?: boolean;
}
