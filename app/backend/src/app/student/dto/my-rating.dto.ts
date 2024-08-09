import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class myRatingDto {

    @IsString()
    @IsOptional()
    searchBy: 'professor' | 'course';

    @IsString()
    @IsOptional()
    search: string;

    @IsOptional()
    @IsNumber()
    studentId?: number;

    @IsNotEmpty()
    @IsNumber()
    page?: number;
}
