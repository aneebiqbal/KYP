import {
  Controller,
  Get,
  Post,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { SearchProfessorDto } from './dto/search-professor.dto';
import { JwtAuthGuard } from '../utils/auth.guard';
import { SaveProfessorDto } from './dto/saved-professor.dto';
import { OptionalJwtAuthGuard } from '../utils/OptionalJwtAuth.guard';

@Controller('professors')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) { }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchProfessor(@Query() query: SearchProfessorDto, @Request() req) {
    const { name, searchBy, sortField, sortOrder } = query;
    const studentId = req.user?.id;
    return this.professorService.searchProfessors(name, searchBy,  sortField, sortOrder, studentId);
  }


  @UseGuards(JwtAuthGuard)
  @Post('saved')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async saveProfessor(@Query() query: SaveProfessorDto, @Request() req) {
    const studentId = req.user?.id;
    const { professorId, flag } = query;
    const professorIdNumber = Number(professorId);
    const flagNumber = Number(flag);
    if (flagNumber === 1) {
      await this.professorService.addSavedProfessor(studentId, professorIdNumber);
      return { message: 'Professor saved successfully' };
    } else if (flagNumber === 0) {
      await this.professorService.removeSavedProfessor(studentId, professorIdNumber);
      return { message: 'Professor unsaved successfully' };
    } else {
      return { message: 'Invalid flag value' };
    }
  }
}
