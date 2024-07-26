import {
  IsEmail,
  IsString,
  IsOptional,
  isString,
  IsNotEmpty,
} from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  password!: string; //--only required for email signups

  @IsString()
  @IsOptional()
  googleId?: string; //--only required for google signups

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  image_url?: string;
}
