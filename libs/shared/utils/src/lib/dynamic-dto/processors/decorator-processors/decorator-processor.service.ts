import { Injectable } from '@nestjs/common';
import { FieldSchema } from '../../core/interfaces/schema';

@Injectable()
export class DecoratorProcessor {
  processDecorators(schema: FieldSchema, context: any): PropertyDecorator[] {
    const decorators: PropertyDecorator[] = [];

    // Add custom decorator processing logic here
    // This could include business-specific decorators,
    // custom validation decorators, etc.

    return decorators;
  }
}
