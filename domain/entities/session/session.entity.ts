import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'bigint' })
  expiresAt: number;

  @Column({ type: 'text' })
  data: string;
}
