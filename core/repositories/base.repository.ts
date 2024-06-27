import { Repository, DeepPartial, FindOptionsWhere, EntityManager, EntityTarget } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BaseRepository<T> {
  private repository: Repository<T>;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly entityClass: EntityTarget<T>,
  ) {
    this.repository = this.entityManager.getRepository(this.entityClass);
  }

  // Fetch all records
  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  // Fetch a single record by ID
  async findOne(id: number): Promise<T> {
    const entity = await this.repository.findOneBy({ id } as unknown as FindOptionsWhere<T>);
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  // Create a new record
  async create(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity);
  }

  // Update an existing record by ID
  async update(id: number, entity: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, entity as any);
    return this.findOne(id);
  }

  // Delete a record by ID
  async delete(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
  }
}
