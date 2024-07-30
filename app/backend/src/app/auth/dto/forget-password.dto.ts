import {
  IsString,
  IsEmail,
} from 'class-validator';

export class ForgetPasswordDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;
}

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  newPassword!: string;
}
