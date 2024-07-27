import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ForgetPasswordDto, ResetPasswordDto } from './dto/forget-password.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('Signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() SignUpDto: SignUpDto) {
    const { email, password, googleId } = SignUpDto;
    if (googleId) {
      const { student, token } = await this.authService.signUpWithGoogle(
        SignUpDto
      );
      return { message: 'Signed up with Google', student, token };
    } else {
      if (!email || !password) {
        throw new BadRequestException(
          'Email and password are required for signup.'
        );
      }
      const { student, token } = await this.authService.signUpWithEmail(
        SignUpDto
      );
      return { message: 'Signed up with email', student, token };
    }
  }


  @Post('Signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() signInDto: SignInDto) {
    const { email, password, googleId } = signInDto;
    if (googleId) {
      const { student, token } = await this.authService.signInWithGoogle(
        signInDto
      );
      return { message: 'Signed in with Google', student, token };
    } else {
      if (!email || !password) {
        throw new BadRequestException(
          'Email and password are required for email sign-in.'
        );
      }
      const { student, token } = await this.authService.signInWithEmail(
        signInDto
      );
      return { message: 'Signed in with email', student, token };
    }
  }


  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    if (!forgetPasswordDto.email) {
      throw new BadRequestException('Email is required');
    }
    const response = await this.authService.forgetPassword(forgetPasswordDto);
    return response;
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    if (!resetPasswordDto.newPassword) {
      throw new BadRequestException('Password is required');
    }
    const response = await this.authService.resetPassword(resetPasswordDto);
    return response;
  }

}
