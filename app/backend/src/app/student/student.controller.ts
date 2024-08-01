import { Controller, Get, UseGuards, HttpCode, HttpStatus, Query, Request } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../utils/auth.guard';
import { myRatingDto } from './dto/my-rating.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  
  @UseGuards(JwtAuthGuard)
  @Get('my-ratings')
  @HttpCode(HttpStatus.OK)
  async myRatings (@Query() query: myRatingDto, @Request() req) {
    const {text, searchBy } = query;
    const studentId = req.user.id;
    console.log(studentId)
    return this.studentService.myRating(text, searchBy,studentId )
  }
 
}
