import { Injectable, ConflictException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Student } from '@kyp/db';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  private readonly jwtSecret = 'KypSecret'; 

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async signUpWithEmail(signUpDto: SignUpDto): Promise<{ student: Partial<Student>; token: string }> {
    const existingStudent = await this.studentRepository.findOne({ where: { email: signUpDto.email } });
    if (existingStudent) {
      throw new ConflictException('Email already in use');
    }
  
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const student = this.studentRepository.create({
      email: signUpDto.email,
      password: hashedPassword,
      external_auth: false,
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

  
}
