import { IsNumber, IsOptional, IsString } from "class-validator";

export class myRatingDto {

    @IsString()
    @IsOptional()
    searchBy: 'professor' | 'course';

    @IsString()
    @IsOptional()
    text: string;

    @IsOptional()
    @IsNumber()
    studentId?: number;

}
