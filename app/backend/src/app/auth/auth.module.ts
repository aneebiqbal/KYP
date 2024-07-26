import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '@kyp/db';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
