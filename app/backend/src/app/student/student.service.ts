import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '@kyp/db';
import { Institute } from '@kyp/db';
import { Professor } from '@kyp/db';
import { UpdateStudentProfileDto, UpdatePasswordDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';


interface CustomProfessorResponse {
  name: string;
  image_url: string;
  department_name: string;
  institute_name: string;
  overall_rating: number;
  total_ratings: number;
  is_saved?: boolean;
  take_again: number;
  love_teaching_style: number;

}
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Institute)
    private readonly instituteRepository: Repository<Institute>,
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
  ) { }

  async updateProfile(studentId: number, updateProfileDto: UpdateStudentProfileDto): Promise<any> {
    const { first_name, last_name, institute_name, email } = updateProfileDto;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Check if student exists
    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Find institute by name
    const institute = await this.instituteRepository.findOne({ where: { name: institute_name } });
    if (!institute) {
      throw new NotFoundException(`Institute with name ${institute_name} not found`);
    }

    // Update student profile
    student.first_name = first_name;
    student.last_name = last_name;
    student.institute = institute;
    student.email = email;

    await this.studentRepository.save(student);
    return { message: 'Profile updated successfully' };
  }

  async updatePassword(studentId: number, updatePasswordDto: UpdatePasswordDto): Promise<any> {
    const { oldPassword, newPassword } = updatePasswordDto;

    // Check if student exists
    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Verify the old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, student.password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    // Hash the new password and update it
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedNewPassword;

    await this.studentRepository.save(student);
    return { message: 'Password updated successfully' };
  }

  async getSavedProfessors(studentId: number, name?: string, institute_name?: string): Promise<CustomProfessorResponse[]> {
    // Ensure student exists
    const student = await this.studentRepository.findOne({
      where: { id: studentId }
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const savedProfessorIds = student.saved_professors;
    console.log(savedProfessorIds);

    if (!savedProfessorIds || savedProfessorIds.length === 0) {
      throw new NotFoundException(`No saved professors found for student with ID ${studentId}`);
    }
    // Create query for saved professors
    const query = this.professorRepository
      .createQueryBuilder('professor')
      .leftJoinAndSelect('professor.institute', 'institute')
      .leftJoinAndSelect('professor.ratings', 'ratings')
      .leftJoinAndSelect('ratings.student', 'student')
      .where('professor.id IN (:...savedProfessorIds)', { savedProfessorIds })
      .andWhere('ratings.deleted_at IS NULL');

    if (name) {
      query.andWhere(
        'professor.first_name ILIKE :name OR professor.last_name ILIKE :name',
        { name: `%${name}%` }
      );
    }

    if (institute_name) {
      query.andWhere('institute.name = :institute_name', { institute_name });
    }


    const professors = await query.getMany();
    if (institute_name && professors.length === 0) {
      throw new NotFoundException(
        `No professors found for institute ${institute_name}`
      );
    }

    // Process the professors to include ratings and saved status
    return professors.map(professor => {
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
      const totalTakeAgain = professor.ratings.filter(rating => rating.take_again).length;
      const takeAgainPercentage = totalRatings > 0 ? (totalTakeAgain / totalRatings) * 100 : 0;

      const totalLoveTeachingStyle = professor.ratings.reduce((acc, rating) => acc + rating.love_teaching_style, 0);
      const loveTeachingStylePercentage = totalRatings > 0 ? (totalLoveTeachingStyle / (totalRatings * 5)) * 100 : 0;

      return {
        name: `${professor.first_name} ${professor.last_name}`,
        image_url: professor.image_url,
        department_name: professor.department_name,
        institute_name: professor.institute.name,
        overall_rating: parseFloat(overallRating.toFixed(2)),
        total_ratings: totalRatings,
        is_saved: true, // All professors in this list are saved by the student
        take_again: parseFloat(takeAgainPercentage.toFixed(2)),
        love_teaching_style: parseFloat(loveTeachingStylePercentage.toFixed(2)),
      } as CustomProfessorResponse;
    });
  }
}
