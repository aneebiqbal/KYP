import type { TypeOrmModuleOptions } from "@nestjs/typeorm";

// export const typeormOptions: TypeOrmModuleOptions = {
//   type: 'postgres',
//   // port: Number(process.env['POSTGRES_PORT']),
//   // username: process.env['POSTGRES_USER'],
//   // password: process.env['POSTGRES_PASSWORD'],
//   // database: process.env['POSTGRES_DB'],
//   // host: process.env['POSTGRES_HOST'],
//   port: 5432,
//   username: 'postgres',
//   password: 'inodb4321',
//   database: 'postgres',
//   host: 'ino-db.cxvgidrqjubc.us-east-1.rds.amazonaws.com',
//   synchronize: true, 
//   entities: [__dirname + '/../**/*.entity.{js,ts}'],
//   ssl: false,
//   dropSchema: true, 

// };
export const typeormOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  port: 5432,
  username: 'kyp',
  password: '12345678',
  database: 'kyp',
  host: 'kyp.c3ogw0s2cjkf.us-east-1.rds.amazonaws.com',
  synchronize: true,
  ssl: false,
};

