import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from '@kyp/db';
import { Student } from '@kyp/db';

@Module({
  imports: [TypeOrmModule.forFeature([Professor, Student])],
  controllers: [ProfessorController],
  providers: [ProfessorService],
})
export class ProfessorModule { }
