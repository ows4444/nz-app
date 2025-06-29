import { Inject, Injectable } from '@nestjs/common';
import type { ICacheManager } from '../../core/interfaces/cache/cache-manager.interface';
import { ClassConstructor } from '../../core/types';
import { DynamicSchemaEntity } from '../../domain/entities/dynamic-schema.entity';
import { DtoGenerationPipeline } from '../pipelines/dto-generation.pipeline';
import { ValidationPipeline } from '../pipelines/validation.pipeline';

@Injectable()
export class DtoOrchestratorService {
  constructor(
    private readonly validationPipeline: ValidationPipeline,
    private readonly generationPipeline: DtoGenerationPipeline,
    @Inject('ICacheManager') private readonly cacheManager: ICacheManager,
  ) {}

  async generateDto(schema: DynamicSchemaEntity): Promise<ClassConstructor<object>> {
    const cacheKey = this.generateCacheKey(schema);

    // Check cache first
    const cached = await this.cacheManager.get<ClassConstructor<object>>(cacheKey);
    if (cached) {
      return cached;
    }

    // Validate schema
    const validationResult = await this.validationPipeline.validate(schema);
    if (!validationResult.isValid) {
      throw new Error(`Schema validation failed: ${validationResult.errors.join(', ')}`);
    }

    // Generate DTO
    const generatedClass = this.generationPipeline.generate(schema);

    // Cache result
    await this.cacheManager.set(cacheKey, generatedClass);

    return generatedClass;
  }

  private generateCacheKey(schema: DynamicSchemaEntity): string {
    return `dto:${schema.name}:${schema.version.toString()}`;
  }
}
