export enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
  DATE = 'date',
  ENUM = 'enum',
  // UNION = 'union',
  // INTERSECTION = 'intersection',
}

export enum ValidationStrategy {
  STRICT = 'strict',
  LENIENT = 'lenient',
  CUSTOM = 'custom',
}

export enum CacheStrategy {
  MEMORY = 'memory',
  REDIS = 'redis',
  HYBRID = 'hybrid',
  NONE = 'none',
}

export enum AutoGenerationType {
  UUID = 'uuid',
  TIMESTAMP = 'timestamp',
  CUSTOM = 'custom',
}
