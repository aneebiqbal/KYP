import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  Param
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ForgetPasswordDto, ResetPasswordDto } from './dto/forget-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async signup(@Body() signUpDto: SignUpDto) {
    const { isGmail } = signUpDto;
    if (isGmail) {
      const { student, token } = await this.authService.signUpWithGoogle(
        signUpDto
      );
      return { message: 'Signed up with Google', student, token };
    } else {
      const { student, token } = await this.authService.signUpWithEmail(
        signUpDto
      );
      return { message: 'Signed up with email', student, token };
    }
  }

  @Get('get_all_institute')
  @HttpCode(HttpStatus.OK)
  async getAllInstitute() {
    return this.authService.GetAllInstitute();
  }

  @Get('department/:institute')
  @HttpCode(HttpStatus.OK)
  async getDepartment(@Param('institute') institute: string) {
      console.log("Inside ------- institute:", institute);
      return this.authService.getDepartments(institute);
  }

  @Post('Signin')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async signin(@Body() signInDto: SignInDto) {
    const { isGmail } = signInDto;
    if (isGmail) {
      const { student, token } = await this.authService.signInWithGoogle(
        signInDto
      );
      return { message: 'Signed in with Google', student, token };
    } else {
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
    // console.log('insside-------',resetPasswordDto)
    if (!resetPasswordDto.newPassword) {
      throw new BadRequestException('Password is required');
    }
    if (!resetPasswordDto.token) {
      throw new BadRequestException('Token is required');
    }
    return await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto
    );
  }
}
