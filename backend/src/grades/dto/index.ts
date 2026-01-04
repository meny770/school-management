import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsNotEmpty,
  IsEnum,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { CommentCategory } from '../../common/enums';

export class CreateGradeDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsNumber()
  @IsNotEmpty()
  gradeValue: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  meetsExpectations?: number;

  @IsArray()
  @IsOptional()
  commentTemplateIds?: string[];

  @IsString()
  @IsOptional()
  customComment?: string;

  @IsString()
  @IsOptional()
  strengthNote?: string;

  @IsString()
  @IsOptional()
  improvementNote?: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;
}

export class CreateCommentTemplateDto {
  @IsEnum(CommentCategory)
  @IsNotEmpty()
  category: CommentCategory;

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class GetGradesQueryDto {
  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString()
  @IsOptional()
  classId?: string;

  @IsString()
  @IsOptional()
  subject?: string;
}

