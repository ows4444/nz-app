import { WithCreated, WithLastSeen, WithUpdated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

class Device extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  deviceId!: string;

  @Column({ type: 'uuid', length: 36 })
  userId!: string;

  @Column()
  deviceInfo!: string;

  @Column({ type: 'bigint', unsigned: true })
  status!: number;

  @Column({ type: 'smallint', unsigned: true, default: 100 })
  trustScore!: number;
}

@Entity({ name: 'devices' })
export class DeviceEntityORM extends WithUpdated(WithCreated(WithLastSeen(Device))) {}
