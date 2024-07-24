import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormOptions } from './config/typeorm-options';
import { Student } from './entities/student.entity';
import { Institute } from './entities/institute.entity';
import { Professor } from './entities/professor.entity';
import { Rating } from './entities/rating.entity';
import { Course } from './entities/cources.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeormOptions,
      entities: [Student, Institute, Professor, Rating, Course],
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Student, Institute, Professor, Rating, Course]),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmCustomModule {}
