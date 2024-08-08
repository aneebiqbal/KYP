import {
  IsEmail,
  IsString,
  IsOptional,
  IsNotEmpty,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email!: string;

  @ValidateIf(o => !o.googleId)
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string; // Only required for email signups

  @IsString()
  @IsOptional()
  googleId?: string; // Only required for Google signups

  @ValidateIf(o => !o.googleId)
  @IsString()
  @IsNotEmpty()
  first_name?: string;

  @ValidateIf(o => !o.googleId)
  @IsString()
  @IsNotEmpty()
  last_name?: string;

  @ValidateIf(o => !o.googleId)
  @IsString()
  @IsOptional()
  image_url?: string;

  @ValidateIf(o => !o.googleId)
  @IsString()
  @IsNotEmpty()
  instituteName?: string;

  @ValidateIf(o => !o.googleId)
  @IsString()
  @IsNotEmpty()
  department?: string;
}
