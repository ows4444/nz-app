import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { BaseFieldProcessor } from '../../core/abstractions/base-field-processor.abstract';
import { FieldType } from '../../core/enums';
import { ArrayFieldProcessor } from './complex/array-field.processor';
import { ObjectFieldProcessor } from './complex/object-field.processor';
import { BooleanFieldProcessor } from './primitive/boolean-field.processor';
import { NumberFieldProcessor } from './primitive/number-field.processor';
import { StringFieldProcessor } from './primitive/string-field.processor';

@Injectable()
export class FieldProcessorRegistry implements OnModuleInit {
  private readonly processors = new Map<FieldType, BaseFieldProcessor>();

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly stringProcessor: StringFieldProcessor,
    private readonly numberProcessor: NumberFieldProcessor,
    private readonly booleanProcessor: BooleanFieldProcessor,
  ) {}

  onModuleInit() {
    // Register primitive processors immediately
    this.registerProcessor(this.stringProcessor);
    this.registerProcessor(this.numberProcessor);
    this.registerProcessor(this.booleanProcessor);

    // Get complex processors after module initialization to handle circular dependencies
    const arrayProcessor = this.moduleRef.get(ArrayFieldProcessor, { strict: false });
    const objectProcessor = this.moduleRef.get(ObjectFieldProcessor, { strict: false });

    if (arrayProcessor) {
      this.registerProcessor(arrayProcessor);
    }

    if (objectProcessor) {
      this.registerProcessor(objectProcessor);
    }
  }

  registerProcessor(processor: BaseFieldProcessor): void {
    this.processors.set(processor.supportedType, processor);
  }

  getProcessor(type: FieldType): BaseFieldProcessor {
    const processor = this.processors.get(type);
    if (!processor) {
      throw new Error(`No processor found for field type: ${type}`);
    }
    return processor;
  }

  hasProcessor(type: FieldType): boolean {
    return this.processors.has(type);
  }

  getAllProcessors(): BaseFieldProcessor[] {
    return Array.from(this.processors.values());
  }

  getSupportedTypes(): FieldType[] {
    return Array.from(this.processors.keys());
  }
}
