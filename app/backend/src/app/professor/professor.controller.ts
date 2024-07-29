import { Controller, Get, Post, Query, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { SearchProfessorDto } from './dto/search-professor.dto';
import { SaveProfessorDto } from './dto/saved-professor.dto';
import { JwtAuthGuard } from '../utils/auth.guard';
import { OptionalJwtAuthGuard } from '../utils/OptionalJwtAuth.guard';

@Controller('professors')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) { }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchProfessor(@Query() query: SearchProfessorDto, @Request() req) {
    const { name, institute_name, sortField, sortOrder } = query;
    const studentId = req.user?.id; 
    return this.professorService.searchProfessors(name, institute_name, studentId, sortField, sortOrder);
  }

  @UseGuards(JwtAuthGuard)
  @Post('saved')
  @HttpCode(HttpStatus.OK)
  async saveProfessor(@Query() query: SaveProfessorDto, @Request() req) {
    const { professorId, flag } = query;
    const studentId = req.user.id;
    console.log(studentId, 'studentId')
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
