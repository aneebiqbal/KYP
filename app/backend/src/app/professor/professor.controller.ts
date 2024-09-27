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
  ValidationPipe,
  Body,
  Param
} from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { SearchProfessorDto,RecommendationProfessorDto } from './dto/search-professor.dto';
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
    const { search, searchBy, sortField, sortOrder,page} = query;
    const studentId = req.user?.id;
    return this.professorService.searchProfessors(search, searchBy,  sortField, sortOrder, studentId, page);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('getRecommendations')
  @HttpCode(HttpStatus.OK)
  async getRecommendations(@Query() query: RecommendationProfessorDto, @Request() req) {
    const { search, searchBy} = query;
    console.log("inside-----",search)
    const studentId = req.user?.id;
    return this.professorService.getRecommendations(search, searchBy,studentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('saved')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async saveProfessor(@Body() body: SaveProfessorDto, @Request() req) {
    const studentId = req.user?.id;
    const { professorId, flag } = body;
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

 @UseGuards(OptionalJwtAuthGuard)
 @Get('saved/professors/:id')
 async getSavedProfessor(@Request() req: any,@Param('id') professorid: number) {
   const studentId = req.user?.id;
   console.log(" request user : ",req.user);
   console.log("student id ",studentId)
   console.log("professorID_____ ",professorid)
   return this.professorService.getSavedProfessor(studentId,professorid)
 }


  @UseGuards(OptionalJwtAuthGuard)
  @Get('details/:id')
  async getProfessorDetails(@Request() req: any,@Param('id') professorid: number) {
    const studentId = req.user?.id;
    console.log(" request user : ",req.user);
    console.log("student id ",studentId)
    return this.professorService.getProfessorDetails(studentId,professorid)
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('coursedetails/:id/:courseCode?')
  async getProfessorCourseDetails(@Request() req: any,@Param('id') professorid: number,@Param('courseCode') courseCode?: string,@Query() query?:any) {
    const {page,limit} = query;
    const studentId = req.user?.id;
    console.log(" request user : ",req.user);
    console.log("student id ",studentId)
    console.log("course id: ",courseCode);
    console.log("page number: ",page);
    console.log("page limit: ",limit)
    return this.professorService.getProfessorCourseDetails(studentId,professorid,page,limit,courseCode)
  }
 
  @Get('course/:professorid')
  async getProfessorCourse(@Param('professorid') professorid: number) {
      console.log("Inside ------- professor id:", professorid);
      return this.professorService.getProfessorCourse(professorid);
  }
}
