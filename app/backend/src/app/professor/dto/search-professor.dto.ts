import { IsOptional, IsString, IsIn } from 'class-validator';

export class SearchProfessorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  searchBy?: string;

  @IsOptional()
  @IsIn(['first_name', 'overall_rating'])
  sortField?: 'first_name' | 'overall_rating' = 'first_name';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
