import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Trail } from './trail.entity';

@Entity()
export class Action {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  actionType: string;

  @Column()
  description: string;

  @OneToMany(() => Trail, (trail) => trail.action)
  auditLogs?: Trail[];
}
