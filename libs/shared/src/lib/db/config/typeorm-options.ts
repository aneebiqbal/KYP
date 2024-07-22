import type { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeormOptions: TypeOrmModuleOptions = {
    type: 'postgres',
    port: Number(process.env['POSTGRES_PORT']),
    username: process.env['POSTGRES_USER'],
    password: process.env['POSTGRES_PASSWORD'],
    database: process.env['POSTGRES_DB'],
    host: process.env['POSTGRES_HOST'],
    synchronize: true,
    ssl: false,
  };
  