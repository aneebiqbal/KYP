import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { Professor, ProfessorCourses, Rating, ReactRating, Student } from '@kyp/db';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Professor, Rating, ReactRating, ProfessorCourses])],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
