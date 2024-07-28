import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { SearchProfessorDto } from './dto/search-professor.dto';
import { SaveProfessorDto } from './dto/saved-professor.dto';

@Controller('professors')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) { }

  @Get('search')
  async searchProfessor(@Query() query: SearchProfessorDto) {
    const { name, instituteId, studentId, sortField, sortOrder } = query;
    return this.professorService.searchProfessors(name, instituteId, studentId, sortField, sortOrder);
  }

  @Post('saved')
  @HttpCode(HttpStatus.OK)
  async saveProfessor(@Query() query: SaveProfessorDto) {
    const { studentId, professorId, flag } = query;
    const studentIdNumber = Number(studentId);
    const professorIdNumber = Number(professorId);
    const flagNumber = Number(flag);
    if (flagNumber === 1) {
      await this.professorService.addSavedProfessor(studentIdNumber, professorIdNumber);
      return { message: 'Professor saved successfully' };
    } else if (flagNumber === 0) {
      await this.professorService.removeSavedProfessor(studentIdNumber, professorIdNumber);
      return { message: 'Professor unsaved successfully' };
    } else {
      return { message: 'Invalid flag value' };
    }
  }
}
