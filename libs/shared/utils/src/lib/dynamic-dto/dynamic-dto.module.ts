import { Module } from '@nestjs/common';
// Core services
import { DtoGenerationPipeline } from './application/pipelines/dto-generation.pipeline';
import { ValidationPipeline } from './application/pipelines/validation.pipeline';
import { DtoOrchestratorService } from './application/services/dto-orchestrator.service';
// Validators
import { BaseSchemaValidator } from './core/abstractions/schema-validator.abstract';
// Infrastructure
import { CacheManagerService } from './infrastructure/cache/cache-manager.service';
import { MemoryCacheStrategy } from './infrastructure/cache/strategies/memory-cache.strategy';
import { DecoratorProcessor } from './processors/decorator-processors/decorator-processor.service';
// Processors
import { ArrayFieldProcessor } from './processors/field-processors/complex/array-field.processor';
import { ObjectFieldProcessor } from './processors/field-processors/complex/object-field.processor';
import { FieldProcessorRegistry } from './processors/field-processors/field-processor.registry';
import { BooleanFieldProcessor } from './processors/field-processors/primitive/boolean-field.processor';
import { NumberFieldProcessor } from './processors/field-processors/primitive/number-field.processor';
import { StringFieldProcessor } from './processors/field-processors/primitive/string-field.processor';
import { StructuralSchemaValidator } from './validators/schema-validators/structural-schema.validator';

@Module({
  providers: [
    // // Core services
    DtoOrchestratorService,
    DtoGenerationPipeline,
    ValidationPipeline,

    // // Processors
    FieldProcessorRegistry,
    StringFieldProcessor,
    NumberFieldProcessor,
    BooleanFieldProcessor,
    ArrayFieldProcessor,
    ObjectFieldProcessor,
    DecoratorProcessor,
    // // Infrastructure
    MemoryCacheStrategy,
    {
      provide: 'ICacheStrategy',
      useClass: MemoryCacheStrategy,
    },
    CacheManagerService,
    {
      provide: 'ICacheManager',
      useClass: CacheManagerService,
    },

    // // Validators
    {
      provide: BaseSchemaValidator,
      useClass: StructuralSchemaValidator,
    },
  ],
  exports: [DtoOrchestratorService, FieldProcessorRegistry],
})
export class DynamicDtoModule {}
