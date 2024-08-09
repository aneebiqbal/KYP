import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Institute, Professor, Rating, Student } from '@kyp/db';
import { UpdateStudentProfileDto, UpdatePasswordDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import { getPaginated, PaginatedResult } from '../utils/getPaginated';

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

export interface CustomProfessorResponse {
  name: string;
  image_url: string;
  department_name: string;
  institute_name: string;
  overall_rating: number;
  total_ratings: number;
  is_saved: boolean;
  take_again: number;
  love_teaching_style: number;
}


@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Institute)
    private readonly instituteRepository: Repository<Institute>,
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    @InjectRepository(Rating)
  private readonly ratingRepository: Repository<Rating>
  ) { }

  async updateProfile(studentId: number, updateProfileDto: UpdateStudentProfileDto): Promise<any> {
    const { first_name, last_name, institute_name, email } = updateProfileDto;

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   throw new BadRequestException('Invalid email format');
    // }

    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const institute = await this.instituteRepository.findOne({ where: { name: institute_name } });
    if (!institute) {
      throw new NotFoundException(`Institute with name ${institute_name} not found`);
    }

    student.first_name = first_name;
    student.last_name = last_name;
    student.institute = institute;
    student.email = email;

    await this.studentRepository.save(student);
    return { message: 'Profile updated successfully' };
  }

  async updatePassword(studentId: number, updatePasswordDto: UpdatePasswordDto): Promise<any> {
    const { oldPassword, newPassword } = updatePasswordDto;

    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, student.password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedNewPassword;

    await this.studentRepository.save(student);
    return { message: 'Password updated successfully' };
  }

  async getSavedProfessors(
    text: string,
    searchBy: 'name' | 'institute',
    studentId: number,
    page = 1,
    limit = 1
  )
    : Promise<PaginatedResult<CustomProfessorResponse>> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId }
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const savedProfessorIds = student.saved_professors;
    console.log(savedProfessorIds);

    if (!savedProfessorIds || savedProfessorIds.length === 0) {
      throw new NotFoundException(`No saved professors found for student with ID ${studentId}`);
    }
    const query = this.professorRepository
      .createQueryBuilder('professor')
      .leftJoinAndSelect('professor.institute', 'institute')
      .leftJoinAndSelect('professor.ratings', 'ratings')
      .leftJoinAndSelect('ratings.student', 'student')
      .where('professor.id IN (:...savedProfessorIds)', { savedProfessorIds })
      .andWhere('ratings.deleted_at IS NULL');

    if (searchBy === 'name') {
      query.andWhere(
        'professor.first_name ILIKE :text OR professor.last_name ILIKE :text',
        { text }
      );
    } else if (searchBy === 'institute') {
      query.andWhere('institute.name = :text', { text });
    }



    const professors = await query.getMany();
    if ( professors.length === 0) {
      throw new NotFoundException(
        `professor not found`
      );
    }

    return getPaginated(professors.map(professor => {
      const totalRatings = professor.ratings.length;
      const overallRating =
        totalRatings > 0
          ? professor.ratings.reduce(
            (acc, rating) =>
              acc +
              (rating.course_difficulty +
                rating.clarity +
                rating.collaboration +
                rating.knowledgeable +
                rating.helpful +
                rating.textbook_use +
                rating.exam_difficulty +
                rating.love_teaching_style) /
              8,
            0
          ) / totalRatings
          : 0;
      const totalTakeAgain = professor.ratings.filter(rating => rating.take_again).length;
      const takeAgainPercentage = totalRatings > 0 ? (totalTakeAgain / totalRatings) * 100 : 0;

      const totalLoveTeachingStyle = professor.ratings.reduce((acc, rating) => acc + rating.love_teaching_style, 0);
      const loveTeachingStylePercentage = totalRatings > 0 ? (totalLoveTeachingStyle / (totalRatings * 5)) * 100 : 0;

      return {
        id:professor.id,
        name: `${professor.first_name} ${professor.last_name}`,
        image_url: professor.image_url,
        department_name: professor.department_name,
        institute_name: professor.institute.name,
        overall_rating: parseFloat(overallRating.toFixed(2)),
        total_ratings: totalRatings,
        is_saved: true,
        take_again: parseFloat(takeAgainPercentage.toFixed(2)),
        love_teaching_style: parseFloat(loveTeachingStylePercentage.toFixed(2)),
      } as CustomProfessorResponse;
    }),page,limit);
  }

  async myRating(
    text: string,
    searchBy: 'name' | 'institute',
    studentId: number,
    page = 1,
    limit = 1
  ): Promise<PaginatedResult<CustomRatingResponse>> {
    const query = this.ratingRepository
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating.student', 'student')
      .leftJoinAndSelect('rating.professor', 'professor')
      .leftJoinAndSelect('rating.course', 'course')
      .leftJoinAndSelect('professor.institute', 'institute')
      .where('student.id = :studentId', { studentId });

    if (searchBy === 'name') {
      query.andWhere(
        'professor.first_name ILIKE :text OR professor.last_name ILIKE :text',
        { text }
      );
    } else if (searchBy === 'institute') {
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
    return getPaginated(Object.values(groupedByProfessor),page,limit);
  }
}
