import { User } from '@domain/entities';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  @Column({ nullable: false, type: 'bigint' })
  createdBy: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updatedBy' })
  @Column({ nullable: true, type: 'bigint' })
  updatedBy: number;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'deletedBy' })
  @Column({ nullable: true, type: 'bigint' })
  deletedBy: number;
}

export class AbstractTableEntity<T> extends BaseEntity<T> {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
}
