import { DynamicSchemaEntity } from '../entities/dynamic-schema.entity';

export class SchemaCompatibilitySpecification {
  isSatisfiedBy(currentSchema: DynamicSchemaEntity, newSchema: DynamicSchemaEntity): boolean {
    return this.areVersionsCompatible(currentSchema, newSchema) && this.areFieldsCompatible(currentSchema, newSchema) && this.areRequiredFieldsCompatible(currentSchema, newSchema);
  }

  private areVersionsCompatible(current: DynamicSchemaEntity, newSchema: DynamicSchemaEntity): boolean {
    return current.isCompatibleWith(newSchema);
  }

  private areFieldsCompatible(current: DynamicSchemaEntity, newSchema: DynamicSchemaEntity): boolean {
    for (const [fieldName, fieldSchema] of Object.entries(current.properties)) {
      if (!newSchema.hasField(fieldName)) {
        if (current.getRequiredFields().includes(fieldName)) {
          return false; // Required field was removed
        }
        continue;
      }

      const newFieldSchema = newSchema.properties[fieldName];
      if (fieldSchema.type !== newFieldSchema.type) {
        return false; // Type change is breaking
      }
    }

    return true;
  }

  private areRequiredFieldsCompatible(current: DynamicSchemaEntity, newSchema: DynamicSchemaEntity): boolean {
    const currentRequired = new Set(current.getRequiredFields());
    const newRequired = new Set(newSchema.getRequiredFields());

    // New required fields that weren't required before
    for (const field of newRequired) {
      if (!currentRequired.has(field)) {
        return false;
      }
    }

    return true;
  }
}
