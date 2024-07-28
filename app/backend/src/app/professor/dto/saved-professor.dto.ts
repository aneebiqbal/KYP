import { IsNumber } from 'class-validator';

export class SaveProfessorDto {
    @IsNumber()
    studentId: number;

    @IsNumber()
    professorId: number;

    @IsNumber()
    flag: number;
}