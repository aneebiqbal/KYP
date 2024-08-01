import { Professor, Rating, Student } from '@kyp/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface CustomRatingResponse {
  professor: {
    id: number;
    name: string;
    image_url: string;
    department_name: string;
    institute_name: string;
    percentage_take_again: string;
    percentage_love_teaching_style: string;
    average_rating: number;
  };
  ratings: {
    student_name: string;
    student_image_url: string;
    for_credit: boolean;
    attendance: boolean;
    tags: string[];
    course_name: string;
    grade_received: string;
    comment: string | null;
    created_at: Date;
  }[];
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

  async myRating(
    text: string,
    searchBy: 'professor' | 'course',
    studentId: number
  ): Promise<CustomRatingResponse[]> {
    const query = this.ratingRepository
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating.student', 'student')
      .leftJoinAndSelect('rating.professor', 'professor')
      .leftJoinAndSelect('rating.course', 'course')
      .leftJoinAndSelect('professor.institute', 'institute')
      .where('student.id = :studentId', { studentId });

    if (searchBy === 'professor') {
      query.andWhere(
        'professor.first_name ILIKE :text OR professor.last_name ILIKE :text',
        { text }
      );
    } else if (searchBy === 'course') {
      query.andWhere('course.name ILIKE :text', { text });
    }

    const ratings = await query.getMany();

    if (ratings.length === 0) {
      throw new NotFoundException('Ratings not found');
    }

    const groupedByProfessor: { [key: number]: CustomRatingResponse } = {};
    const professorRatingsCount: { [key: number]: number } = {};
    const professorTakeAgainCount: { [key: number]: number } = {};
    const professorLoveTeachingStyleCount: { [key: number]: number } = {};
    const professorTotalRating: { [key: number]: number } = {};
    const professorRatingCount: { [key: number]: number } = {};

    ratings.forEach((rating) => {
      const professorId = rating.professor.id;

      if (!groupedByProfessor[professorId]) {
        groupedByProfessor[professorId] = {
          professor: {
            id: professorId,
            name: `${rating.professor.first_name} ${rating.professor.last_name}`,
            image_url: rating.professor.image_url || 'N/A',
            department_name: rating.professor.department_name || 'N/A',
            institute_name: rating.professor.institute?.name || 'N/A',
            percentage_take_again: '',
            percentage_love_teaching_style: '',
            average_rating: 0,
          },
          ratings: [],
        };
        professorRatingsCount[professorId] = 0;
        professorTakeAgainCount[professorId] = 0;
        professorLoveTeachingStyleCount[professorId] = 0;
        professorTotalRating[professorId] = 0;
        professorRatingCount[professorId] = 0;
      }
      professorRatingsCount[professorId] += 1;
      if (rating.take_again) professorTakeAgainCount[professorId] += 1;
      if (rating.love_teaching_style >= 4)
        professorLoveTeachingStyleCount[professorId] += 1;

      professorTotalRating[professorId] +=
        (rating.course_difficulty +
          rating.clarity +
          rating.collaboration +
          rating.knowledgeable +
          rating.helpful +
          rating.textbook_use +
          rating.exam_difficulty +
          rating.love_teaching_style) /
        8;

      professorRatingCount[professorId] += 1;

      groupedByProfessor[professorId].ratings.push({
        student_name: `${rating.student.first_name} ${rating.student.last_name}`,
        student_image_url: rating.student.image_url || 'N/A',
        for_credit: rating.for_credit,
        attendance: rating.mandatory_attendance,
        tags: rating.tags || [],
        course_name: rating.course?.name || 'N/A',
        grade_received: rating.grade_received,
        comment: rating.comment || null,
        created_at: rating.created_at,
      });

      Object.values(groupedByProfessor).forEach((professorData) => {
        const professorId = professorData.professor.id;

        const totalRatings = professorRatingsCount[professorId];
        const takeAgainCount = professorTakeAgainCount[professorId];
        const loveTeachingStyleCount =
          professorLoveTeachingStyleCount[professorId];
        const averageRating =
          professorTotalRating[professorId] / professorRatingCount[professorId];

        professorData.professor.percentage_take_again =
          ((takeAgainCount / totalRatings) * 100).toFixed(2) + '%';
        professorData.professor.percentage_love_teaching_style =
          ((loveTeachingStyleCount / totalRatings) * 100).toFixed(2) + '%';
        professorData.professor.average_rating = averageRating;
      });
    });
    return Object.values(groupedByProfessor);
  }
}
