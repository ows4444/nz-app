import { Component } from '@domain/entities';
import { EntityManager } from 'typeorm';
import { BaseRepository } from '@core/repositories';

export class ComponentRepository extends BaseRepository<Component> {
  constructor(entityManager: EntityManager) {
    super(entityManager, Component);
  }
}
