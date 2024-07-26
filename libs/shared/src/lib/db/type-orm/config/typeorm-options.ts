import type { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeormOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  port: Number(process.env['DATABASE_PORT']),
  username: process.env['DATABASE_USERNAME'],
  password: process.env['DATABASE_PASSWORD'],
  database: process.env['DATABASE_NAME'],
  host: process.env['DATABASE_PORT'],
  synchronize: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  ssl: false,

};
