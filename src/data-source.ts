// data-source.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `${process.cwd()}/src/config/env/${
    process.env.NODE_ENV ?? 'development'
  }.env`,
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_ROOT,
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE,

  entities: ['dist/**/*.entity.js'], // or ['src/**/*.entity.ts'] for dev
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
