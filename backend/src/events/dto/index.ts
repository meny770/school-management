import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { EventType, EventSeverity } from '../../common/enums';

export class CreateEducationalEventDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsEnum(EventType)
  @IsNotEmpty()
  eventType: EventType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(EventSeverity)
  @IsNotEmpty()
  severity: EventSeverity;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsArray()
  @IsOptional()
  notifiedTo?: string[];
}

export class GetEventsQueryDto {
  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString()
  @IsOptional()
  teacherId?: string;

  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;
}

