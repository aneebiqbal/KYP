import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException, UsePipes, ValidationPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ForgetPasswordDto, ResetPasswordDto } from './dto/forget-password.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async signup(@Body() signUpDto: SignUpDto) {
    const { email, password, googleId } = signUpDto;
    if (googleId) {
      const { student, token } = await this.authService.signUpWithGoogle(signUpDto);
      return { message: 'Signed up with Google', student, token };
    } else {
      if (!email || !password) {
        throw new BadRequestException('Email and password are required');
      }
      const { student, token } = await this.authService.signUpWithEmail(signUpDto);
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
    return await this.authService.forgetPassword(forgetPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    if (!resetPasswordDto.newPassword) {
      throw new BadRequestException('Password is required');
    }
    return await this.authService.resetPassword(resetPasswordDto);
  }

}
