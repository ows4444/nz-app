import { WithLinked } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

class UserDevice extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', length: 36 })
  deviceId!: string;

  @Column({ type: 'uuid', length: 36 })
  userId!: string;

  @Column({ type: 'bigint', unsigned: true })
  status!: number;

  @Column({ type: 'timestamp', nullable: true })
  linkedAt!: Date;
}

@Entity({ name: 'user_devices' })
export class UserDeviceEntityORM extends WithLinked(UserDevice) {}
