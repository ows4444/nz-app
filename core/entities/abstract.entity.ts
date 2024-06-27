import { User } from '@domain/entities';
import { Column, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum Status {
  ACTIVE = 1,
  INACTIVE = 2,
  DELETED = 3,
  PENDING = 4,
}

class BaseEntity<T> {
  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }

  @Column({ type: 'enum', enum: Status, default: Status.INACTIVE })
  status: Status;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, { eager: true })
  creator: User;

  @ManyToMany(() => User, { eager: true })
  creation: User[];

  @ManyToOne(() => User, { eager: true })
  editor: User;

  @ManyToMany(() => User, { eager: true })
  modification: User[];

  @ManyToOne(() => User, { eager: true })
  remover: User;

  @ManyToMany(() => User, { eager: true })
  deletion: User[];
}

export class AbstractTableEntity<T> extends BaseEntity<T> {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
}
