import { IsOptional, IsString, IsIn, IsNumber, IsNotEmpty } from 'class-validator';

export class SearchProfessorDto {
  @IsOptional()
  @IsNumber()
  studentId?: number;

  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  searchBy: 'professor' | 'institute';


  @IsOptional()
  @IsIn(['first_name', 'overall_rating'])
  sortField?: 'first_name' | 'overall_rating' = 'first_name';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @IsNotEmpty()
  @IsNumber()
  page?: number;
}


export class RecommendationProfessorDto {
  @IsOptional()
  @IsNumber()
  studentId?: number;

  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  searchBy: 'professor' | 'institute';
}
