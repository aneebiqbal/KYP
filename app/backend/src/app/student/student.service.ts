import { Professor, Rating, Student } from '@kyp/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface CustomRatingResponse {
  id: number;
  name: string;
  image_url: string;
  department_name: string;
  institute_name: string;
  ratings: {
    student_name: string;
    student_image_url: string;
    take_again: number;
    love_teaching_style: number;
    for_credit: boolean;
    attandance: boolean;
    upvotes: number;
    downvotes: number;
    reported: number;
    tags: [];
  }
}
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>
  ) {}

  async myRating (
    text: string,
    searchBy: 'professor' | 'course',
    studentId: number
  ) {
    const query = await this.ratingRepository
    .createQueryBuilder('rating')
    .leftJoinAndSelect('rating.student', 'student')
    .leftJoinAndSelect('rating.professor', 'professor')
    .leftJoinAndSelect('rating.course', 'course')
    .where('student.id = :studentId', { studentId })

    // const query = await this.ratingRepository
    // .createQueryBuilder('student')
    // .leftJoinAndSelect('student.rating', 'rating')
    // .leftJoinAndSelect('rating.professor', 'professor')
    // .leftJoinAndSelect('rating.course', 'course')
    // .where('student.id = :studentId', { studentId })

    if (searchBy === 'professor') {
      query.andWhere(
        'professor.first_name ILIKE :text OR professor.last_name ILIKE :text' ,
        {text: text}
      )
    } else if (searchBy === 'course') {
      query.andWhere('course.name ILIKE :text', {text: text})
    }
    const rating = await query.getMany()
    if(!rating && rating.length > 0) {
      throw new NotFoundException('ratings not found')
    }
    return rating;
  }
}
