import { IsOptional, IsString, IsNumber } from 'class-validator';

export class SavedProfessorsQueryDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsString()
    @IsOptional()
    searchBy: 'professor' | 'institute';

    @IsString()
    @IsOptional()
    text: string;
}