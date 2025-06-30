export enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
  DATE = 'date',
  ENUM = 'enum',
  FILE = 'file',
  JSON = 'json',
  REFERENCE = 'reference',
  COMPUTED = 'computed',
  UNION = 'union',
  TUPLE = 'tuple',
  MAP = 'map',
  SET = 'set',
}
export enum AutoGenerationType {
  UUID = 'uuid',
  TIMESTAMP = 'timestamp',
  INCREMENTAL = 'incremental',
  SLUG = 'slug',
  HASH = 'hash',
  RANDOM_STRING = 'random_string',
  SEQUENCE = 'sequence',
}

export enum ValidationStrategy {
  STRICT = 'strict',
  LOOSE = 'loose',
  TRANSFORM = 'transform',
  SANITIZE = 'sanitize',
}

export enum CacheStrategy {
  MEMORY = 'memory',
  REDIS = 'redis',
  HYBRID = 'hybrid',
  NONE = 'none',
}
