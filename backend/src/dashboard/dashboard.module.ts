import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Grade } from '../grades/entities/grade.entity';
import { EducationalEvent } from '../events/entities/educational-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Grade, EducationalEvent])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

