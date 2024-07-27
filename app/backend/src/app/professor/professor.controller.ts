import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { SearchProfessorDto } from './dto/search-professor.dto';

@Controller('professors')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Get('search')
  async searchProfessor(@Query() query: SearchProfessorDto) {
    const { name, instituteId, sortField, sortOrder } = query;
    return this.professorService.searchProfessors(name, instituteId, sortField, sortOrder);
  }

}
