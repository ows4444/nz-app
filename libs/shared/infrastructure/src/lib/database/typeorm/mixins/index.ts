import { Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = object> = new (...args: any[]) => T;

export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type MixinReturn<TBase extends Constructor, TNew> = TBase extends Constructor<infer R> ? Constructor<UnionToIntersection<R & TNew>> : never;

export interface IWithCreated {
  createdAt: Date;
}

export interface IWithUpdated {
  updatedAt: Date;
}

export interface IWithSoftDelete {
  deletedAt: Date | null;
}

export interface IWithExpiration {
  expiresAt: Date | null;
}

export interface IWithRevocation {
  revokedAt: Date | null;
  revokedUntil: Date | null;
}

export function WithCreated<TBase extends Constructor>(Base: TBase): MixinReturn<TBase, IWithCreated> {
  class CreatedMixin extends Base {
    @CreateDateColumn({
      type: 'timestamp',
      precision: 6,
      default: (): string => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt!: Date;
  }
  return CreatedMixin as unknown as MixinReturn<TBase, IWithCreated>;
}

export function WithUpdated<TBase extends Constructor>(Base: TBase): MixinReturn<TBase, IWithUpdated> {
  class UpdatedMixin extends Base {
    @UpdateDateColumn({
      type: 'timestamp',
      precision: 6,
      default: () => 'CURRENT_TIMESTAMP(6)',
    })
    updatedAt!: Date;
  }
  return UpdatedMixin as unknown as MixinReturn<TBase, IWithUpdated>;
}

export function WithSoftDelete<TBase extends Constructor>(Base: TBase): MixinReturn<TBase, IWithSoftDelete> {
  class SoftDeleteMixin extends Base {
    @DeleteDateColumn({ type: 'timestamp', precision: 6, nullable: true })
    deletedAt!: Date | null;
  }
  return SoftDeleteMixin as unknown as MixinReturn<TBase, IWithSoftDelete>;
}

export function WithExpiration<TBase extends Constructor>(Base: TBase): MixinReturn<TBase, IWithExpiration> {
  class ExpirationMixin extends Base {
    @Column({ type: 'timestamp', precision: 6, nullable: true })
    expiresAt!: Date | null;
  }
  return ExpirationMixin as unknown as MixinReturn<TBase, IWithExpiration>;
}

export function WithRevocation<TBase extends Constructor>(Base: TBase): MixinReturn<TBase, IWithRevocation> {
  class RevocationMixin extends Base {
    @Column({ type: 'timestamp', precision: 6, nullable: true })
    revokedAt!: Date | null;

    @Column({ type: 'timestamp', precision: 6, nullable: true })
    revokedUntil!: Date | null;
  }
  return RevocationMixin as unknown as MixinReturn<TBase, IWithRevocation>;
}
