import { IsOptional, IsString, IsIn, IsNumber } from 'class-validator';

export class SearchProfessorDto {
  @IsOptional()
  @IsNumber()
  studentId?: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  searchBy: 'professor' | 'institute';


  @IsOptional()
  @IsIn(['first_name', 'overall_rating'])
  sortField?: 'first_name' | 'overall_rating' = 'first_name';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
