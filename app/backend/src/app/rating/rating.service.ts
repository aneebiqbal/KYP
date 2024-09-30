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

  async getReview( ratingId: number, professorId: number, studentId:number): Promise<any> {
    try{
      let upVotes = 0;
      let downVotes = 0;
      let reported = 0;
      let ReactRatings = { upvote: false, downvote: false, reported: false };

      let professor = await this.professorRepository.findOne({
        where: { id: professorId, },
        relations: ['institute'],
      });

       console.log(professor)

      let query = this.ratingRepository
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating.course','course')
      .leftJoinAndSelect('rating.reactRatings','reactRatings')
      .where("rating.id = :ratingId",{ratingId})

      if(studentId){
        query.leftJoinAndSelect('reactRatings.student','student')
      }
       const rating = await query.getMany()
       console.log(rating)

       if (rating?.length > 0) {
        rating[0].reactRatings.map((reactRating)=>{
          if (studentId && reactRating?.student.id === studentId) {
            ReactRatings.upvote = reactRating.upvote;
            ReactRatings.downvote = reactRating.downvote;
            ReactRatings.reported = reactRating.reported;
          }
          if (reactRating.upvote) upVotes++;
          if (reactRating.downvote) downVotes++;
          if (reactRating.reported) reported++;
        })
       }
       return {
        id:professor.id,
        name: professor.first_name+ " " + professor.last_name,
        department: professor.department_name,
        institute_name:professor.institute.name,
        rating_id:rating[0].id,
        comment:rating[0].comment,
        course_code:rating[0].course.course_code,
        tags:rating[0].tags,
        for_credit: rating[0].for_credit,
        textbook_use:rating[0].textbook_use,
        attendance: rating[0].mandatory_attendance,
        reactRatings: ReactRatings,
        upVotes,
        downVotes,
        reports: reported,
       }

    }  catch (error) {
      console.error(error);
    return new Error('An error occurred while retrieving professor details');
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
