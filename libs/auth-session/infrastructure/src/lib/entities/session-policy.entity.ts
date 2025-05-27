import { WithCreated } from '@nz/shared-infrastructure';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

class SessionPolicy extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  policyId!: string;

  @Column({ type: 'int', unsigned: true })
  maxSessions!: number;

  @Column({ type: 'int', unsigned: true })
  inactivityTimeout!: number;
}

@Entity({ name: 'session_policies' })
export class SessionPolicyEntityORM extends WithCreated(SessionPolicy) {}
