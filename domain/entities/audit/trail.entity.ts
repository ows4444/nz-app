import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Action } from './action.entity';
import { User } from '../user';

@Entity()
export class Trail {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.trails)
  user: User;

  @Column()
  entityName: string;

  @Column()
  entityId: number;

  @Column({ nullable: true, type: 'json' })
  oldValue: string;

  @Column({ nullable: true, type: 'json' })
  newValue: string;

  @ManyToOne(() => Action, (action) => action.auditLogs)
  action: Action;
}
