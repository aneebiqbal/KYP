import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor, Rating, Student } from '@kyp/db';

@Module({
  imports: [TypeOrmModule.forFeature([Professor, Student, Rating])],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
