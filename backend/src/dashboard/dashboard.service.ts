import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Grade } from '../grades/entities/grade.entity';
import { EducationalEvent } from '../events/entities/educational-event.entity';
import { User } from '../common/entities/user.entity';
import { errorHandler } from '../utils';

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
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	async getTeacherDashboard(teacherId: string): Promise<TeacherDashboardData> {
		const teacher = await this.userRepository
			.findOne({ where: { uuid: teacherId } })
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/dashboard/dashboard.service.ts',
					functionName: 'getTeacherDashboard',
					errorStatusObject: NotFoundException,
					message: `Teacher not found: ${teacherId}`,
					title: 'Teacher Lookup Failed',
				})
			);

		if (!teacher) {
			throw new NotFoundException(`Teacher with ID "${teacherId}" not found`);
		}

		const today = new Date();
		const sevenDaysAgo = new Date(today);
		sevenDaysAgo.setDate(today.getDate() - 7);

		// Count recent grades by this teacher
		const recentGradesCount = await this.gradeRepository
			.count({ where: { teacherId: teacher.id } })
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/dashboard/dashboard.service.ts',
					functionName: 'getTeacherDashboard',
					message: `Failed to count grades for teacher ${teacherId}`,
					title: 'Grade Count Failed',
				})
			);

		// Count recent events by this teacher
		const recentEventsCount = await this.eventsRepository
			.count({ where: { teacherId: teacher.id } })
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/dashboard/dashboard.service.ts',
					functionName: 'getTeacherDashboard',
					message: `Failed to count events for teacher ${teacherId}`,
					title: 'Event Count Failed',
				})
			);

		// TODO: Count missing attendance items
		const missingAttendanceCount = 0; // Placeholder

		// Count high severity events
		const highSeverityEventsCount = await this.eventsRepository
			.createQueryBuilder('event')
			.where('event.teacherId = :teacherId', { teacherId: teacher.id })
			.andWhere('event.severity = :severity', { severity: 'HIGH' })
			.andWhere('event.date >= :sevenDaysAgo', { sevenDaysAgo })
			.getCount()
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/dashboard/dashboard.service.ts',
					functionName: 'getTeacherDashboard',
					message: `Failed to count high severity events for teacher ${teacherId}`,
					title: 'High Severity Event Count Failed',
				})
			);

		return {
			missingAttendanceCount,
			recentGradesCount,
			recentEventsCount,
			highSeverityEventsCount,
		};
	}
}
