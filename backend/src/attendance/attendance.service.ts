import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { Lesson } from '../common/entities/lesson.entity';
import { Student } from '../common/entities/student.entity';
import {
	CreateAttendanceDto,
	UpdateAttendanceDto,
	MarkFullDayAbsentDto,
	GetAttendanceQueryDto,
} from './dto';
import { AttendanceStatus } from '../common/enums';

@Injectable()
export class AttendanceService {
	constructor(
		@InjectRepository(Attendance)
		private attendanceRepository: Repository<Attendance>,
		@InjectRepository(Lesson)
		private lessonRepository: Repository<Lesson>,
		@InjectRepository(Student)
		private studentRepository: Repository<Student>
	) {}

	async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
		const lesson = await this.lessonRepository.findOne({
			where: { uuid: createAttendanceDto.lessonId },
		});

		if (!lesson) {
			throw new NotFoundException(
				`Lesson with ID "${createAttendanceDto.lessonId}" not found`
			);
		}

		const student = await this.studentRepository.findOne({
			where: { uuid: createAttendanceDto.studentId },
		});

		if (!student) {
			throw new NotFoundException(
				`Student with ID "${createAttendanceDto.studentId}" not found`
			);
		}

		// Check if attendance record already exists
		const existing = await this.attendanceRepository.findOne({
			where: {
				lessonId: lesson.id,
				studentId: student.id,
			},
		});

		if (existing) {
			// Update existing record
			Object.assign(existing, createAttendanceDto);
			return this.attendanceRepository.save(existing);
		}

		// Create new record
		const attendance = this.attendanceRepository.create({
			...createAttendanceDto,
			lessonId: lesson.id,
			studentId: student.id,
		});
		return this.attendanceRepository.save(attendance);
	}

	async findAll(query: GetAttendanceQueryDto): Promise<Attendance[]> {
		const where: any = {};

		if (query.lessonId) {
			where.lessonId = query.lessonId;
		}

		if (query.studentId) {
			where.studentId = query.studentId;
		}

		if (query.date) {
			where.date = query.date;
		}

		if (query.from && query.to) {
			where.date = Between(new Date(query.from), new Date(query.to));
		}

		return this.attendanceRepository.find({
			where,
			relations: {
				lesson: true,
				student: true,
			},
			order: { date: 'DESC' },
		});
	}

	async findByStudent(
		studentId: string,
		from?: string,
		to?: string
	): Promise<Attendance[]> {
		const where: any = { studentId };

		if (from && to) {
			where.date = Between(new Date(from), new Date(to));
		}

		return this.attendanceRepository.find({
			where,
			relations: ['lesson'],
			order: { date: 'DESC' },
		});
	}

	async update(
		id: string,
		updateAttendanceDto: UpdateAttendanceDto
	): Promise<Attendance> {
		const attendance = await this.attendanceRepository.findOne({
			where: { uuid: id },
		});

		if (!attendance) {
			throw new NotFoundException(`Attendance record with ID ${id} not found`);
		}

		Object.assign(attendance, updateAttendanceDto);
		return this.attendanceRepository.save(attendance);
	}

	/**
	 * Business Rule: Mark student absent for entire day
	 *
	 * When a teacher marks a student as "absent for full day" on a given date,
	 * the system automatically creates/updates attendance entries for ALL lessons
	 * of that student on that date.
	 *
	 * This ensures consistency and saves teachers time from marking each lesson individually.
	 *
	 * @param markFullDayAbsentDto Contains studentId, date, and optional justification
	 * @returns Array of created/updated attendance records
	 */
	async markAbsentForFullDay(
		markFullDayAbsentDto: MarkFullDayAbsentDto
	): Promise<Attendance[]> {
		const { studentId, date, isJustified, comment } = markFullDayAbsentDto;

		const student = await this.studentRepository.findOne({
			where: { uuid: studentId },
		});

		if (!student) {
			throw new NotFoundException(`Student with ID "${studentId}" not found`);
		}

		// TODO: Find all lessons for this student on the given date
		// This requires joining through the student's class to get their lesson schedule
		const lessons = await this.findLessonsForStudentOnDate(studentId, date);

		if (lessons.length === 0) {
			throw new NotFoundException(
				`No lessons found for student ${studentId} on date ${date}`
			);
		}

		// Create or update attendance for each lesson
		const attendanceRecords: Attendance[] = [];

		for (const lesson of lessons) {
			const existing = await this.attendanceRepository.findOne({
				where: {
					lessonId: lesson.id,
					studentId: student.id,
				},
			});

			if (existing) {
				// Update existing record
				existing.status = AttendanceStatus.ABSENT;
				existing.isJustified = isJustified || false;
				existing.comment = comment || `Marked absent for full day`;
				existing.date = new Date(date);
				attendanceRecords.push(await this.attendanceRepository.save(existing));
			} else {
				// Create new record
				const newAttendance = this.attendanceRepository.create({
					lessonId: lesson.id,
					studentId: student.id,
					date: new Date(date),
					status: AttendanceStatus.ABSENT,
					isJustified: isJustified || false,
					comment: comment || `Marked absent for full day`,
				});
				attendanceRecords.push(
					await this.attendanceRepository.save(newAttendance)
				);
			}
		}

		return attendanceRecords;
	}

	/**
	 * Helper method to find all lessons for a student on a specific date
	 * @param studentId Student UUID
	 * @param date Date string
	 * @returns Array of lessons
	 */
	private async findLessonsForStudentOnDate(
		studentId: string,
		date: string
	): Promise<Lesson[]> {
		// TODO: Implement proper query joining student -> class -> lessons
		// For now, return a basic query
		// In a real implementation, you would:
		// 1. Get the student's classId
		// 2. Find all lessons for that class on the given date

		return this.lessonRepository
			.createQueryBuilder('lesson')
			.innerJoin('lesson.class', 'class')
			.innerJoin('class.students', 'student')
			.where('student.uuid = :studentId', { studentId })
			.andWhere('lesson.date = :date', { date })
			.getMany();
	}

	async remove(id: string): Promise<void> {
		const attendance = await this.attendanceRepository.findOne({
			where: { uuid: id },
		});

		if (!attendance) {
			throw new NotFoundException(`Attendance record with ID ${id} not found`);
		}

		await this.attendanceRepository.delete(attendance.id);
	}
}
