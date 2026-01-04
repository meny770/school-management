import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { AttendanceStatus } from '../../common/enums';

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  lessonId: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;

  @IsBoolean()
  @IsOptional()
  isJustified?: boolean;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class UpdateAttendanceDto {
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @IsBoolean()
  @IsOptional()
  isJustified?: boolean;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class MarkFullDayAbsentDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsBoolean()
  @IsOptional()
  isJustified?: boolean;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class GetAttendanceQueryDto {
  @IsString()
  @IsOptional()
  lessonId?: string;

  @IsString()
  @IsOptional()
  studentId?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;
}

