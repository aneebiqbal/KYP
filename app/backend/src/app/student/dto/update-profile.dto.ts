import { IsEmail, IsString } from 'class-validator';

export class UpdateStudentProfileDto {
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    institute_name: string;

    @IsEmail()
    email: string;
}

export class UpdatePasswordDto {
    @IsString()
    oldPassword: string;

    @IsString()
    newPassword: string;
}