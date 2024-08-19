import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class rateProfessorDto {
  @IsInt()
  studentId: number;

  @IsInt()
  professorId: number;

  @IsInt()
  courseId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  course_difficulty: number;

  @IsInt()
  @Min(1)
  @Max(5)
  clarity: number;

  @IsInt()
  @Min(1)
  @Max(5)
  collaboration: number;

  @IsInt()
  @Min(1)
  @Max(5)
  helpful: number;

  @IsInt()
  @Min(1)
  @Max(5)
  textbook_use: number;

  @IsInt()
  @Min(1)
  @Max(5)
  exam_difficulty: number;

  @IsInt()
  @Min(1)
  @Max(5)
  love_teaching_style: number;

  @IsOptional()
  @IsBoolean()
  take_again?: boolean;

  @IsOptional()
  @IsBoolean()
  mandatory_attendance?: boolean;

  @IsOptional()
  @IsBoolean()
  for_credit?: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  grade_received?: string;

  @IsOptional()
  @IsString()
  @Length(0, 512)
  comment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
