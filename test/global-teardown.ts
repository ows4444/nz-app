require('dotenv').config({ path: '.env.test' });
import { DataSource } from 'typeorm';
module.exports = async () => {
  try {
    const DB_NAME = process.env.TYPEORM_DATABASE;

    const AppDataSource = new DataSource({
      type: process.env.TYPEORM_TYPE as any,
      host: process.env.TYPEORM_HOST,
      port: +process.env.TYPEORM_PORT,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: '',
      synchronize: false,
      logging: false,
    });

    await AppDataSource.initialize();
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    // Drop the existing database
    await queryRunner.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);

    console.log(`Database ${DB_NAME} has been dropped.`);
  } catch (error) {
    console.error('Error in global-teardown.ts:', error);
    process.exit(1);
  }
};
