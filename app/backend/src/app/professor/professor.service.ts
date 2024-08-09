import { Professor, Student } from '@kyp/db';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPaginated, PaginatedResult } from '../utils/getPaginated';


interface professor{
  id:number;
  name: string;
  image_url: string;
  department_name: string;
  institute_name: string;
  overall_rating: number;
  total_ratings: number;
  is_saved?: boolean;
  take_again: number;
  love_teaching_style: number;
}

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>
  ) {}

  async searchProfessors(
    name?: string,
    searchBy?: string,
    sortField: 'first_name' | 'overall_rating' = 'first_name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    studentId?:number,
    page = 1,
    limit = 1
  ): Promise<PaginatedResult<professor>> {
    const query = this.professorRepository
      .createQueryBuilder('professor')
      .leftJoinAndSelect('professor.institute', 'institute')
      .leftJoinAndSelect('professor.ratings', 'ratings')
      .leftJoinAndSelect('ratings.student', 'student')
      .where('ratings.deleted_at IS NULL');
    if (name) {
      if(searchBy === 'name'){
          query.andWhere(
            'professor.first_name ILIKE :name OR professor.last_name ILIKE :name',
            { name: `%${name}%` }
          );
      }else if(searchBy === 'institute'){
        query.andWhere(
          `institute.name ILIKE :name`,
          { name }
        );
      }
    }

    // if (institute_name) {
    //   query.andWhere('institute.name = :institute_name', { institute_name });
    // }

    if (sortField !== 'overall_rating') {
      query.orderBy(`professor.${sortField}`, sortOrder);
    }
    const professors = await query.getMany();
    if ( professors.length === 0) {
      throw new NotFoundException(
        `No professors found by ${searchBy}`
      );
    }

    let savedProfessors: number[] = [];
    if (studentId) {
      const student = await this.studentRepository.findOne({
        where: { id: studentId },
      });
      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }
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

      const is_saved = savedProfessors.includes(professor.id);

      return {
        ...professor,
        overallRating: parseFloat(overallRating.toFixed(2)),
        totalRatings,
        is_saved,
      };
    });

    const sortedProfessors = professorsWithRatings.sort((a, b) => {
      if (sortField === 'overall_rating') {
        return sortOrder === 'DESC'
          ? a.overallRating - b.overallRating
          : b.overallRating - a.overallRating;
      }
      return 0;
    });

    return getPaginated(sortedProfessors.map((professor) => {
      const totalRatings = professor.ratings.length;
      const totalTakeAgain = professor.ratings.filter(rating => rating.take_again).length;
      const takeAgainPercentage = totalRatings > 0 ? (totalTakeAgain / totalRatings) * 100 : 0;
      const totalLoveTeachingStyle = professor.ratings.reduce((acc, rating) => acc + rating.love_teaching_style, 0);
      const loveTeachingStylePercentage = totalRatings > 0 ? (totalLoveTeachingStyle / (totalRatings * 5)) * 100 : 0;
      const response: professor = {
        id: professor.id,
        name: `${professor.first_name} ${professor.last_name}`,
        image_url: professor.image_url,
        department_name: professor.department_name,
        institute_name: professor.institute.name,
        overall_rating: professor.overallRating,
        take_again: parseFloat(takeAgainPercentage.toFixed(2)),
        love_teaching_style: parseFloat(loveTeachingStylePercentage.toFixed(2)),
        total_ratings: professor.totalRatings,
      };
      if (studentId) {
        response.is_saved = professor.is_saved;
      }
      return response;
    }), page, limit);
  }

  async addSavedProfessor(
    studentId: number,
    professorId: number
  ): Promise<void> {
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
      throw new NotFoundException(`Professor with id ${professorId} not found`);
    }

    if (!student.saved_professors) {
      student.saved_professors = [];
    }
    if (student.saved_professors.includes(professorId)) {
      throw new BadRequestException(
        `Professor with ID ${professorId} is already in the saved professors list`
      );
    }
    if (!student.saved_professors.includes(professorId)) {
      student.saved_professors.push(professorId);
      await this.studentRepository.save(student);
    }
  }

  async removeSavedProfessor(
    studentId: number,
    professorId: number
  ): Promise<void> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with id ${studentId} not found`);
    }
    const professor = await this.professorRepository.findOne({
      where: { id: professorId },
    });
    if (!professor) {
      throw new NotFoundException(`Professor with id ${professorId} not found`);
    }
    if (student) {
      if (!student.saved_professors) {
        student.saved_professors = [];
      }
      const savedProfessorIndex = student.saved_professors.indexOf(professorId);
      if (savedProfessorIndex === -1) {
        throw new NotFoundException(
          `Professor with id ${professorId} is not in the saved professors list`
        );
      }

      student.saved_professors = student.saved_professors.filter(
        (id) => id !== professorId
      );
      await this.studentRepository.save(student);
    }
  }
}
