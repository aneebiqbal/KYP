import { IsOptional, IsString, IsNumber } from 'class-validator';

export class SavedProfessorsQueryDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    institute_name?: string;
}