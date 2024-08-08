import { IsNumber } from 'class-validator';

export class SaveProfessorDto {

    @IsNumber()
    professorId: number;

    @IsNumber()
    flag: number;
}