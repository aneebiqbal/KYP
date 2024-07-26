import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '@kyp/db';
import { Institute } from '@kyp/db';
import { UtilsModule } from '../utils/utils.modules';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Institute]),
    UtilsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
