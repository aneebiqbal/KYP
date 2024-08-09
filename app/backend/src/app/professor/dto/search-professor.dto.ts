import { IsOptional, IsString, IsNumber, IsIn, isString } from 'class-validator';

export class SearchProfessorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  institute_name?: string;

  @IsOptional()
  @IsNumber()
  studentId?: number;

  @IsOptional()
  @IsIn(['first_name', 'overall_rating'])
  sortField?: 'first_name' | 'overall_rating' = 'first_name';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
