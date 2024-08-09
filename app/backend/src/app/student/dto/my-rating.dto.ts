import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class myRatingDto {

    @IsString()
    @IsOptional()
    searchBy: 'name' | 'institute';

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
