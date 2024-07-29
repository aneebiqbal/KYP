import { Professor } from '@kyp/db';
import { Student } from '@kyp/db';  // Assuming Student entity is imported from the same path
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface CustomProfessorResponse {
  username: string;
  image_url: string;
  department_name: string;
  institute_name: string;
  overall_rating: number;
  total_ratings: number,
  ratings: {
    student_name: string;
    take_again: boolean;
    love_teaching_style: number;
  }[];
  isFavorite: boolean;  // Add flag for favorite professors
}

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>
  ) { }

  async searchProfessors(
    name?: string,
    instituteId?: number,
    studentId?: number,
    sortField: 'first_name' | 'overall_rating' = 'first_name',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<CustomProfessorResponse[]> {
    const query = this.professorRepository
      .createQueryBuilder('professor')
      .leftJoinAndSelect('professor.institute', 'institute')
      .leftJoinAndSelect('professor.ratings', 'ratings')
      .leftJoinAndSelect('ratings.student', 'student')
      .where('ratings.deleted_at IS NULL');

    if (name) {
      query.andWhere(
        'professor.first_name ILIKE :name OR professor.last_name ILIKE :name',
        { name: `%${name}%` }
      );
    }

    if (instituteId) {
      query.andWhere('professor.institute.id = :instituteId', { instituteId });
    }

    if (sortField !== 'overall_rating') {
      query.orderBy(`professor.${sortField}`, sortOrder);
    }
    const professors = await query.getMany();

    // Fetch the student's saved professors if a student ID is provided
    let savedProfessors: number[] = [];
    if (studentId) {
      const student = await this.studentRepository.findOne({ where: { id: studentId } });
      savedProfessors = student ? student.saved_professors : [];
    }

    const professorsWithRatings = professors.map((professor) => {
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

      const isFavorite = savedProfessors.includes(professor.id);

      return {
        ...professor,
        overallRating: parseFloat(overallRating.toFixed(2)),
        totalRatings,
        isFavorite,
      };
    });

    const sortedProfessors = professorsWithRatings.sort((a, b) => {
      if (sortField === 'overall_rating') {
        return sortOrder === 'ASC'
          ? a.overallRating - b.overallRating
          : b.overallRating - a.overallRating;
      }
      return 0;
    });

    return sortedProfessors.map((professor) => ({
      username: `${professor.first_name} ${professor.last_name}`,
      image_url: professor.image_url,
      department_name: professor.department_name,
      institute_name: professor.institute.name,
      overall_rating: professor.overallRating,
      total_ratings: professor.totalRatings,
      ratings: professor.ratings.map((rating) => ({
        student_name: `${rating.student.first_name} ${rating.student.last_name}`,
        take_again: rating.take_again,
        love_teaching_style: rating.love_teaching_style,
      })),
      isFavorite: professor.isFavorite,
    }));
  }

  async addSavedProfessor(studentId: number, professorId: number): Promise<void> {
    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (student) {
      if (!student.saved_professors.includes(professorId)) {
        student.saved_professors.push(professorId);
        await this.studentRepository.save(student);
      }
    }
  }

  async removeSavedProfessor(studentId: number, professorId: number): Promise<void> {
    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (student) {
      student.saved_professors = student.saved_professors.filter(id => id !== professorId);
      await this.studentRepository.save(student);
    }
  }
}
