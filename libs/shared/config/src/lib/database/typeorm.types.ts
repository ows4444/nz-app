export enum DatabaseType {
  MYSQL = 'mysql',
  POSTGRES = 'postgres',
  SQLITE = 'sqlite',
  MARIADB = 'mariadb',
  MSSQL = 'mssql',
}

export type TypeOrmEnvironment = {
  type: DatabaseType;
  database: string;
  username: string;
  password: string;
  host: string;
  port: number;
  logging: boolean;
  synchronize: boolean;
  runMigrations: boolean;
};
