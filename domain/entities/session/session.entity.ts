import { SessionEntity } from '@core/helpers/typeorm-store';
import { Entity, Column, PrimaryColumn, BaseEntity } from 'typeorm';

@Entity()
export class Session extends BaseEntity implements SessionEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'bigint' })
  expiresAt: number;

  @Column({ type: 'text' })
  data: string;
}
