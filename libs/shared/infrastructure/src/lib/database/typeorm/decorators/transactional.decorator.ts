import { DataSource, QueryRunner } from 'typeorm';

export function Transactional() {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const dataSource: DataSource = (this as { dataSource: DataSource }).dataSource;
      if (!dataSource) {
        throw new Error('DataSource is not injected in the class.');
      }

      const queryRunner: QueryRunner = dataSource.createQueryRunner();

      try {
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const result = await originalMethod.apply(this, [...args, queryRunner.manager]);

        await queryRunner.commitTransaction();
        return result;
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    };
  };
}
