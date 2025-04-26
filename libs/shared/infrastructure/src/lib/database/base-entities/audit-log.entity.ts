import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class AuditLog extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column()
  targetEntity!: string;

  @Column({ type: 'json', nullable: true })
  targetId: unknown;

  @Column({ type: 'json', nullable: true })
  previousState?: unknown;

  @Column({ type: 'json', nullable: true })
  newState?: unknown;

  @Column({ type: 'json', nullable: true })
  metadata?: unknown;
}
