// src/professors/professor.service.ts
import { Professor } from '@kyp/db';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface CustomProfessorResponse {
  username: string;
  image_url: string;
  department_name: string;
  institute_name: string;
  overall_rating: number;
  ratings: {
    student_name: string;
    take_again: boolean;
    love_teaching_style: number;
  }[];
}

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>
  ) {}

  async searchProfessors(
    name?: string,
    instituteId?: number,
    sortField: string = 'first_name',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<CustomProfessorResponse[]> {
    const query = this.professorRepository
      .createQueryBuilder('professor')
      .leftJoinAndSelect('professor.institute', 'institute')
      .leftJoinAndSelect('professor.ratings', 'ratings')
      .leftJoinAndSelect('ratings.student', 'student');

    if (name) {
      query.andWhere(
        'professor.first_name ILIKE :name OR professor.last_name ILIKE :name',
        {
          name: `%${name}%`,
        }
      );
    }

    if (instituteId) {
      query.andWhere('professor.institute.id = :instituteId', { instituteId });
    }

    query.orderBy(`professor.${sortField}`, sortOrder);

    const professors = await query.getMany();

    return professors.map((professor) => {
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

      return {
        username: `${professor.first_name} ${professor.last_name}`,
        image_url: professor.image_url,
        department_name: professor.department_name,
        institute_name: professor.institute.name,
        overall_rating: parseFloat(overallRating.toFixed(2)),
        ratings: professor.ratings.map((rating) => ({
          student_name: `${rating.student.first_name} ${rating.student.last_name}`,
          take_again: rating.take_again,
          love_teaching_style: rating.love_teaching_style,
        })),
      };
    });
  }
}
