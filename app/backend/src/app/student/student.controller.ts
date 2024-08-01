import { Body, Controller, Post, UseGuards, Request, Get, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../utils/auth.guard';
import { UpdateStudentProfileDto, UpdatePasswordDto } from './dto/update-profile.dto';
import { StudentService } from './student.service';
import { SavedProfessorsQueryDto } from './dto/seach-saved-professor.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @UseGuards(JwtAuthGuard)
  @Post('update-profile')
  async updateProfile(@Body() updateProfileDto: UpdateStudentProfileDto, @Request() req) {
    const studentId = req.user?.id;
    return this.studentService.updateProfile(studentId, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Request() req) {
    const studentId = req.user?.id;
    return this.studentService.updatePassword(studentId, updatePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('saved-professors')
  async getSavedProfessors(@Query() query: SavedProfessorsQueryDto, @Request() req) {
    const studentId = req.user?.id; // Get student ID from the request
    return this.studentService.getSavedProfessors(studentId, query.name, query.institute_name);
  }
}
