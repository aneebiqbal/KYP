import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SaveProfessorDto {
    @IsNumber()
    @IsOptional()
    studentId: number;

    @IsString()
    @IsNotEmpty()
    professorId: number;

    @IsString()
    @IsNotEmpty()
    flag: number;
}

