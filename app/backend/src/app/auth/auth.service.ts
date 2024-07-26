import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Student } from '@kyp/db';
import { Institute } from '@kyp/db';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  private readonly jwtSecret = 'KypSecret';

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Institute)
    private readonly instituteRepository: Repository<Institute>,
  ) { }

  async signUpWithEmail(signUpDto: SignUpDto): Promise<{ student: Partial<Student>; token: string }> {
    const existingStudent = await this.studentRepository.findOne({ where: { email: signUpDto.email } });
    if (existingStudent) {
      throw new ConflictException('Email already in use');
    }

    let institute: Institute | null = null;
    if (signUpDto.instituteName) {
      institute = await this.instituteRepository.findOne({ where: { name: signUpDto.instituteName } });
      if (!institute) {
        throw new NotFoundException(`Institute with name ${signUpDto.instituteName} not found`);
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
      institute: institute, // Set the Institute relationship
    });

    await this.studentRepository.save(student);

    const token = jwt.sign({ id: student.id, email: student.email }, this.jwtSecret, { expiresIn: '1h' });

    return {
      student: {
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        image_url: student.image_url,
        isActive: student.isActive,
      },
      token
    };
  }

  async signUpWithGoogle(signUpDto: SignUpDto): Promise<{ student: Partial<Student>; token: string }> {
    const existingStudent = await this.studentRepository.findOne({ where: { email: signUpDto.email } });
    if (existingStudent) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(signUpDto.googleId, 10); // Assuming googleId is used as a password for some reason
    const student = this.studentRepository.create({
      email: signUpDto.email,
      auth_pass: hashedPassword,
      external_auth: true,
      first_name: signUpDto.first_name,
      last_name: signUpDto.last_name,
      image_url: signUpDto.image_url,
    });

    await this.studentRepository.save(student);

    const token = jwt.sign({ id: student.id, email: student.email }, this.jwtSecret, { expiresIn: '1h' });

    return {
      student: {
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        image_url: student.image_url,
        isActive: student.isActive,
      },
      token
    };
  }

  async signInWithEmail(signInDto: SignInDto): Promise<{ student: Partial<Student>; token: string }> {
    const { email, password } = signInDto;
    const student = await this.studentRepository.findOne({ where: { email } });

    if (!student) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = jwt.sign({ id: student.id, email: student.email }, this.jwtSecret, { expiresIn: '1h' });

    return {
      student: {
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        image_url: student.image_url,
        isActive: student.isActive,
      },
      token
    };
  }

  async signInWithGoogle(signInDto: SignInDto): Promise<{ student: Partial<Student>; token: string }> {
    const { googleId } = signInDto;
    const student = await this.studentRepository.findOne({ where: { external_auth: true } });

    if (!student) {
      throw new UnauthorizedException('Invalid Google ID');
    }

    // Compare the hashed Google ID with the stored hash
    const isPasswordValid = await bcrypt.compare(googleId, student.auth_pass);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Google ID');
    }
    const token = jwt.sign({ id: student.id, email: student.email }, this.jwtSecret, { expiresIn: '1h' });

    return {
      student: {
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        image_url: student.image_url,
        isActive: student.isActive,
      },
      token
    };
  }
}


