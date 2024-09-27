import { Professor, ProfessorCourses, Rating, ReactRating, Student } from '@kyp/db';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReactRatingDto } from './dto/react-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    @InjectRepository(ReactRating)
    private readonly reactRatingRepository: Repository<ReactRating>,
    @InjectRepository(ProfessorCourses)
    private readonly professorCoursesRepository: Repository<ProfessorCourses>
  ) {}

  async reactToRating(
    studentId: number,
    reactRatingDto: ReactRatingDto
  ): Promise<any> {
    const { ratingId, upvote, downvote, report } = reactRatingDto;
    console.log("data in react rating: ",reactRatingDto)
    try {
      if (upvote && downvote) {
        throw new BadRequestException(
          'Cannot upvote and downvote simultaneously'
        );
      }

      const rating = await this.ratingRepository.findOne({
        where: { id: ratingId },
      });
      if (!rating) {
        throw new NotFoundException(`Rating with ID ${ratingId} not found`);
      }

      let reactRating = await this.reactRatingRepository.findOne({
        where: {
          student: { id: studentId },
          rating: { id: ratingId },
        },
      });

      if (reactRating) {
        reactRating.upvote = upvote ?? reactRating.upvote;
        reactRating.downvote = downvote ?? reactRating.downvote;
        reactRating.reported = report ?? reactRating.reported;
      } else {
        reactRating = this.reactRatingRepository.create({
          student: { id: studentId },
          rating: { id: ratingId },
          upvote: upvote ?? false,
          downvote: downvote ?? false,
          reported: report ?? false,
        });
        console.log("created")
      }

      console.log("react rating: ",reactRating)
      await this.reactRatingRepository.save(reactRating);
      return { message: 'Reaction updated successfully' };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error; 
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }

  async rateProfessor(studentId: number, rateProfessorDto: any): Promise<any> {
    try {
      const {
        professorId,
        courseId,
        course_difficulty,
        clarity,
        collaboration,
        knowledgeable,
        overallRating,
        textbook_use,
        exam_difficulty,
        love_teaching_style,
        take_again,
        mandatory_attendance,
        for_credit,
        grade_received,
        comment,
        tags,
      } = rateProfessorDto;

      const student = await this.studentRepository.findOne({
        where: { id: studentId },
      });
      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      const professor = await this.professorRepository.findOne({
        where: { id: professorId },
      });

      if (!professor) {
        throw new NotFoundException(
          `Professor with ID ${professorId} not found`
        );
      }

      const professorCourse = await this.professorCoursesRepository.findOne({
        where: {
          professor: { id: professorId },
          course: { id: courseId },
        },
      });
      if (!professorCourse) {
        throw new NotFoundException(
          `Professor with ID ${professorId} does not teach course with ID ${courseId}.`
        );
      }

      // const existingRating = await this.ratingRepository.findOne({
      //   where: {
      //     student: { id: studentId },
      //     professor: { id: professorId },
      //     course: { id: courseId },
      //   },
      // });
  
      // console.log("Student ID: ",studentId);
      // console.log("Course ID: ",courseId);
      // console.log("Professor ID: ",professorId);
      // console.log("exiting rating: ",existingRating);

      // if (existingRating) {
      //   throw new BadRequestException(
      //     'You have already rated this professor for this course.'
      //   );
      // }
  

      const rating = this.ratingRepository.create({
        student,
        professor,
        course: courseId,
        course_difficulty,
        clarity,
        collaboration,
        knowledgeable,
        overallRating,
        textbook_use,
        exam_difficulty,
        love_teaching_style,
        take_again: take_again ?? null,
        mandatory_attendance: mandatory_attendance ?? null,
        for_credit: for_credit ?? null,
        grade_received: grade_received ?? null,
        comment: comment ?? null,
        tags: tags ?? [],
      })

      await this.ratingRepository.save(rating);
      return { message: 'Rating created successfully' };


    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }
}
