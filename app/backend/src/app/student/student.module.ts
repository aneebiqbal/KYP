import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentController } from './student.controller';
import { Student } from '@kyp/db';
import { Institute } from '@kyp/db';
import { Professor } from '@kyp/db';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Institute, Professor])],

  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule { }
