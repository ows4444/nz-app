import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

import { StringColumn } from '../typeorm';

export class AuditAction extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @StringColumn({ nullable: false, uppercase: true, trim: true })
  actionType!: string;

  @StringColumn({ trim: true })
  description!: string;
}
