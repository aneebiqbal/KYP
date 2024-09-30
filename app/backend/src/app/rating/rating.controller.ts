import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  UsePipes,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { JwtAuthGuard } from '../utils/auth.guard';
import { ReactRatingDto } from './dto/react-rating.dto';
import { rateProfessorDto } from './dto/rate-professor.dto';
import { OptionalJwtAuthGuard } from '../utils/OptionalJwtAuth.guard';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('react-rating')
  async reactToRating(@Body() reactRatingDto: ReactRatingDto, @Request() req) {
    const studentId = req.user?.id;
    return this.ratingService.reactToRating(studentId, reactRatingDto);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Get('review/:professorId/:ratingId')
  async getReview(@Request() req: any,@Param('professorId') professorId:number,@Param('ratingId') ratingId:number) {
    console.log("inside------")
    const studentId = req.user?.id;
    return this.ratingService.getReview(ratingId,professorId,studentId)
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post('rate-Professor')
  async rateProfessor(@Body() rateProfessorDto: rateProfessorDto, @Request() req) {
    console.log("inside------")
    const studentId = req.user?.id;
    // const StudentIdNumber = Number(studentId);
    console.log("student id: ",typeof(studentId))
    console.log("rate professor: ",rateProfessorDto)
    return this.ratingService.rateProfessor(studentId, rateProfessorDto)
  }
}
