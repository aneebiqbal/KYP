// src/professors/professor.service.ts
import { Professor } from '@kyp/db';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
  ) {}

  async searchProfessors(
    name?: string,
    instituteId?: number,
    sortField: string = 'first_name',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<Professor[]> {
    const query = this.professorRepository.createQueryBuilder('professor')
      .leftJoinAndSelect('professor.institute', 'institute')
      .leftJoinAndSelect('professor.ratings', 'ratings');

    if (name) {
      query.andWhere('professor.first_name ILIKE :name OR professor.last_name ILIKE :name', {
        name: `%${name}%`
      });
    }

    if (instituteId) {
      query.andWhere('professor.institute.id = :instituteId', { instituteId });
    }

    query.orderBy(`professor.${sortField}`, sortOrder);

    return await query.getMany();
  }
}
