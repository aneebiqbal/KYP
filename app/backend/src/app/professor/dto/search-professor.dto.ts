import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator';

export class SearchProfessorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  instituteId?: number;

  @IsOptional()
  @IsString()
  sortField?: string = 'first_name';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
