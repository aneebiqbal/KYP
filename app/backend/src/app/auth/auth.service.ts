import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Student } from '@kyp/db';
import { Institute } from '@kyp/db';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { MailService } from '../utils/mail-service';
import { ForgetPasswordDto, ResetPasswordDto } from './dto/forget-password.dto';

@Injectable()
export class AuthService {
  private readonly jwtSecret = 'KypSecret';
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Institute)
    private readonly instituteRepository: Repository<Institute>,
    private readonly mailService: MailService
  ) {}

  async signUpWithEmail(
    signUpDto: SignUpDto
  ): Promise<{ student: Partial<Student>; token: string }> {
    const existingStudent = await this.studentRepository.findOne({
      where: { email: signUpDto.email },
    });
    if (existingStudent) {
      throw new ConflictException('Email already in use');
    }
    let institute: Institute | null = null;
    if (signUpDto.instituteName) {
      institute = await this.instituteRepository.findOne({
        where: { name: signUpDto.instituteName },
      });
      if (!institute) {
        throw new NotFoundException(
          `Institute with name ${signUpDto.instituteName} not found`
        );
      }
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const student = this.studentRepository.create({
      email: signUpDto.email,
      password: hashedPassword,
      external_auth: false,
      first_name: signUpDto.first_name,
      last_name: signUpDto.last_name,
      institute: institute,
      department: signUpDto.department,
    });
    await this.studentRepository.save(student);
    const token = jwt.sign(
      { id: student.id, email: student.email },
      this.jwtSecret,
      { expiresIn: '1h' }
    );
    console.log("student id: ",student.id)
    return {
      student: {
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        isActive: student.isActive,
        institute: student.institute,
        department: student.department,
      },
      token,
    };
  }

  async GetAllInstitute(): Promise<any> {
    const institute = await this.instituteRepository.find()
    console.log("institute",institute);
    return { institute };
  }

  async signUpWithGoogle(
    signUpDto: SignUpDto
  ): Promise<{ student: Partial<Student>; token: string }> {
    const existingStudent = await this.studentRepository.findOne({
      where: { email: signUpDto.email },
    });
    if (existingStudent) {
      throw new ConflictException('Student already in use');
    }
    const student = this.studentRepository.create({
      email: signUpDto.email,
      external_auth: true,
      first_name: signUpDto.first_name,
      last_name: signUpDto.last_name,
      image_url: signUpDto.image_url,
    });
    await this.studentRepository.save(student);
    const token = jwt.sign(
      { id: student.id, email: student.email },
      this.jwtSecret,
      { expiresIn: '1h' }
    );
    return {
      student: {
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        isActive: student.isActive,
      },
      token,
    };
  }

  async signInWithEmail(
    signInDto: SignInDto
  ): Promise<{ student: Partial<Student>; token: string }> {
    const { email, password } = signInDto;
    const student = await this.studentRepository.findOne({ where: { email }, relations: ['institute']  });
    if (!student) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = jwt.sign(
      { id: student.id, email: student.email },
      this.jwtSecret,
      { expiresIn: '1h' }
    );
    console.log("inside Student--------",student)
    return {
      student: {
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        image_url: student.image_url,
        isActive: student.isActive,
        institute: student?.institute,
      },
      token,
    };
  }

  async signInWithGoogle(
    signInDto: SignInDto
  ): Promise<{ student: Partial<Student>; token: string }> {
    const { email } = signInDto;
    const student = await this.studentRepository.findOne({
      where: { email: email },
    });
    if (!student) {
      throw new UnauthorizedException('User does not exist!');
    }
    const token = jwt.sign(
      { id: student.id, email: student.email },
      this.jwtSecret,
      { expiresIn: '1h' }
    );
    return {
      student: {
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        image_url: student.image_url,
        isActive: student.isActive,
      },
      token,
    };
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<boolean> {
    const student = await this.studentRepository.findOne({
      where: { email: forgetPasswordDto.email },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const token = jwt.sign(
      { id: student.id, email: student.email },
      this.jwtSecret,
      { expiresIn: '1h' }
    );

    await this.mailService.sendPasswordResetEmail(
      forgetPasswordDto.email,
      token
    );

    return true;
    // {
    //   message: 'Password reset email sent',
    //   student: {
    //     id: student.id,
    //     first_name: student.first_name,
    //     last_name: student.last_name,
    //     email: student.email,
    //     image_url: student.image_url,
    //     isActive: student.isActive,
    //   },
    //   token,
    // };
  }

  async resetPassword(
    token: string,
    resetPasswordDto: ResetPasswordDto
  ): Promise<{ message: string }> {
    const { newPassword } = resetPasswordDto;
console.log("inside funct-------",newPassword)
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as {
        id: number;
        email: string;
      };
      const studentId = decoded.id;

      const student = await this.studentRepository.findOne({
        where: { id: studentId },
      });
      if (!student) {
        throw new UnauthorizedException('Invalid token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      student.password = hashedPassword;

      await this.studentRepository.save(student);
      console.log(" sucessfully password change")
      return { message: 'Password Reset Successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
