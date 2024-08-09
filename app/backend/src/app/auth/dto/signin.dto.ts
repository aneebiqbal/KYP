import {
    IsEmail,
    IsString,
    IsOptional,
    IsNotEmpty,
} from 'class-validator';

export class SignInDto {
    @IsEmail({}, { message: 'Invalid email address' })
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    googleId?: string;
}
