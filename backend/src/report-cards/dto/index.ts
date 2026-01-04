import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReportCardLineDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsNumber()
  @IsNotEmpty()
  finalGrade: number;

  @IsString()
  @IsOptional()
  comments?: string;
}

export class CreateReportCardDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsInt()
  @IsNotEmpty()
  semester: number;
}

export class AddReportCardLinesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReportCardLineDto)
  lines: CreateReportCardLineDto[];
}

export class GetReportCardsQueryDto {
  @IsString()
  @IsOptional()
  studentId?: string;
}

