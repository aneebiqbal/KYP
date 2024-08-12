import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class SaveProfessorDto {
    @IsNumber()
    @IsOptional()
    studentId: number;

    @IsNumber()
    @IsNotEmpty()
    professorId: number;

    @IsNumber()
    @IsNotEmpty()
    flag: number;
}

