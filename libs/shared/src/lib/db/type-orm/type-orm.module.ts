import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormOptions } from './config/typeorm-options';
import { Student } from './entities/student.entity';
import { Institute } from './entities/institute.entity';
import { Professor } from './entities/professor.entity';
import { Rating } from './entities/rating.entity';
import { Course } from './entities/cources.entity';
import { ReactRating } from './entities/react-rating.entity';
import { ProfessorCourses } from './entities/professor-courses.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeormOptions,
      entities: [Student, Institute, Professor, Rating, Course, ReactRating, ProfessorCourses],
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Student, Institute, Professor, Rating, Course, ReactRating, ProfessorCourses]),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmCustomModule {}
