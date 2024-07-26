import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
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
    private readonly mailService: MailService,
  ) { }

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
      image_url: signUpDto.image_url,
      institute: institute,
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
        image_url: student.image_url,
        isActive: student.isActive,
      },
      token,
    };
  }


  async signUpWithGoogle(
    signUpDto: SignUpDto
  ): Promise<{ student: Partial<Student>; token: string }> {
    const timestamp = Date.now();
    const generatedEmail = ` ${timestamp}@kyp.com`;
    const student = this.studentRepository.create({
      email: generatedEmail,
      auth_pass: signUpDto.googleId,
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
        image_url: student.image_url,
        isActive: student.isActive,
      },
      token,
    };
  }


  async signInWithEmail(
    signInDto: SignInDto
  ): Promise<{ student: Partial<Student>; token: string }> {
    const { email, password } = signInDto;
    const student = await this.studentRepository.findOne({ where: { email } });
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


  async signInWithGoogle(
    signInDto: SignInDto
  ): Promise<{ student: Partial<Student>; token: string }> {
    const { googleId } = signInDto;
    const student = await this.studentRepository.findOne({
      where: { auth_pass: googleId },
    });
    if (!student) {
      throw new UnauthorizedException('Invalid Google ID');
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

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<{ message: string; student: Partial<Student>; token: string }> {
    const student = await this.studentRepository.findOne({ where: { email: forgetPasswordDto.email } });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const token = jwt.sign({ id: student.id, email: student.email }, this.jwtSecret, { expiresIn: '1h' });

    await this.mailService.sendPasswordResetEmail(forgetPasswordDto.email, token);

    return {
      message: 'Password reset email sent',
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

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { id: number; email: string };
      const email = decoded.email; // Extract email from decoded token

      const student = await this.studentRepository.findOne({ where: { email } });
      if (!student) {
        throw new UnauthorizedException('Invalid token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      student.password = hashedPassword;

      await this.studentRepository.save(student);
      return { message: "Password Reset Successfully" }

    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }

  }
}
