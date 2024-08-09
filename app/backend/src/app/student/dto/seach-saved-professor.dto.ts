import { IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class SavedProfessorsQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsString()
    @IsOptional()
    searchBy: 'name' | 'institute';

    @IsNotEmpty()
    @IsNumber()
    page?: number;
}
