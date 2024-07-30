import {
  IsEmail,
  IsString,
  IsOptional,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
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

  @IsOptional()
  @IsString()
  instituteName?: string;
}
