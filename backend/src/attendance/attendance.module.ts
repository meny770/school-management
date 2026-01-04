import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Attendance } from './entities/attendance.entity';
import { Lesson } from '../common/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Lesson])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}

