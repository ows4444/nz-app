import { WithLinked } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity } from 'typeorm';

class UserDevice extends BaseEntity {
  @Column({ type: 'uuid', length: 36 })
  deviceId!: string;

  @Column({ type: 'uuid', length: 36 })
  userId!: string;

  @Column()
  deviceInfo!: string;

  @Column({ type: 'bigint', unsigned: true })
  status!: number;
}

@Entity({ name: 'user_devices' })
export class UserDeviceEntityORM extends WithLinked(UserDevice) {}
