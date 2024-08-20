import {
  IsEmail,
  IsString,
  IsOptional,
  IsNotEmpty,
  MinLength,
  ValidateIf,
  IsBoolean,
} from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email!: string;

  @ValidateIf((o) => !o.isGmail)
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string; // Only required for email signups

  @IsBoolean()
  @IsOptional()
  isGmail?: boolean; // Only required for Google signups

  @IsString()
  @IsNotEmpty()
  first_name?: string;

  @IsString()
  @IsNotEmpty()
  last_name?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @ValidateIf((o) => !o.isGmail)
  @IsString()
  @IsNotEmpty()
  instituteName?: string;

  @ValidateIf((o) => !o.isGmail)
  @IsString()
  @IsNotEmpty()
  department?: string;
}
