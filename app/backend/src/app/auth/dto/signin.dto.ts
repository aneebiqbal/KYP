import {
  IsEmail,
  IsString,
  IsOptional,
  IsNotEmpty,
  isBoolean,
  IsBoolean,
  ValidateIf,
} from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email: string;

  @ValidateIf((o) => !o.isGmail)
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  isGmail?: boolean;
}
