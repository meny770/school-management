import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import {
  CreateAttendanceDto,
  UpdateAttendanceDto,
  MarkFullDayAbsentDto,
  GetAttendanceQueryDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Post('mark-full-day-absent')
  markFullDayAbsent(@Body() markFullDayAbsentDto: MarkFullDayAbsentDto) {
    return this.attendanceService.markAbsentForFullDay(markFullDayAbsentDto);
  }

  @Get()
  findAll(@Query() query: GetAttendanceQueryDto) {
    return this.attendanceService.findAll(query);
  }

  @Get('student/:studentId')
  findByStudent(
    @Param('studentId') studentId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.attendanceService.findByStudent(studentId, from, to);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}

