import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Grade } from '../grades/entities/grade.entity';
import { EducationalEvent } from '../events/entities/educational-event.entity';

export interface TeacherDashboardData {
  missingAttendanceCount: number;
  recentGradesCount: number;
  recentEventsCount: number;
  highSeverityEventsCount: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,
    @InjectRepository(EducationalEvent)
    private eventsRepository: Repository<EducationalEvent>,
  ) {}

  async getTeacherDashboard(teacherId: string): Promise<TeacherDashboardData> {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // TODO: Implement proper queries based on teacher's classes
    // For MVP, return mock/aggregated data

    // Count recent grades by this teacher
    const recentGradesCount = await this.gradeRepository.count({
      where: {
        teacherId: teacherId,
      },
    });

    // Count recent events by this teacher
    const recentEventsCount = await this.eventsRepository.count({
      where: {
        teacherId: teacherId,
      },
    });

    // TODO: Count missing attendance items
    // This would require complex logic to find lessons without attendance records
    const missingAttendanceCount = 0; // Placeholder

    // Count high severity events
    const highSeverityEventsCount = await this.eventsRepository
      .createQueryBuilder('event')
      .where('event.teacherId = :teacherId', { teacherId })
      .andWhere('event.severity = :severity', { severity: 'HIGH' })
      .andWhere('event.date >= :sevenDaysAgo', { sevenDaysAgo })
      .getCount();

    return {
      missingAttendanceCount,
      recentGradesCount,
      recentEventsCount,
      highSeverityEventsCount,
    };
  }
}

