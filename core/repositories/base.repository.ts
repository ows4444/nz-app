import { NotFoundException } from '@nestjs/common';
import { DeepPartial, EntityManager, EntityTarget, FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

export class BaseRepository<T> {
  private repository: Repository<T>;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly entityClass: EntityTarget<T>,
  ) {
    this.repository = this.entityManager.getRepository(this.entityClass);
  }

  async getEntityName(): Promise<string> {
    return this.repository.metadata.tableName;
  }

  // Fetch all records
  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findAllBy(options: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findOneBy(options: FindOptionsWhere<T>): Promise<T> {
    return this.repository.findOneBy(options);
  }

  // Fetch a single record by ID
  async findOneById(id: number): Promise<T | null> {
    return await this.repository.findOneBy({ id } as unknown as FindOptionsWhere<T>);
  }

  // Create a new record
  async create(entity: DeepPartial<T>): Promise<T> {
    const entityData = this.repository.create(entity);
    return this.repository.save(entityData);
  }

  // Update an existing record by ID
  async update(id: number, entity: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, entity as any);
    return this.findOneById(id);
  }

  // Delete a record by ID
  async delete(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
  }
}
