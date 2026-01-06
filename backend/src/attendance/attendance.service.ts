import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
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
import { errorHandler } from '../utils';

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
		const lesson = await this.lessonRepository
			.findOne({ where: { uuid: createAttendanceDto.lessonId } })
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/attendance/attendance.service.ts',
					functionName: 'create',
					errorStatusObject: NotFoundException,
					message: `Lesson not found: ${createAttendanceDto.lessonId}`,
					title: 'Lesson Lookup Failed',
				})
			);

		if (!lesson) {
			throw new NotFoundException(
				`Lesson with ID "${createAttendanceDto.lessonId}" not found`
			);
		}

		const student = await this.studentRepository
			.findOne({ where: { uuid: createAttendanceDto.studentId } })
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/attendance/attendance.service.ts',
					functionName: 'create',
					errorStatusObject: NotFoundException,
					message: `Student not found: ${createAttendanceDto.studentId}`,
					title: 'Student Lookup Failed',
				})
			);

		if (!student) {
			throw new NotFoundException(
				`Student with ID "${createAttendanceDto.studentId}" not found`
			);
		}

		// Check if attendance record already exists
		const existing = await this.attendanceRepository
			.findOne({
				where: {
					lessonId: lesson.id,
					studentId: student.id,
				},
			})
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/attendance/attendance.service.ts',
					functionName: 'create',
					message: `Failed to check existing attendance for student ${createAttendanceDto.studentId} in lesson ${createAttendanceDto.lessonId}`,
					title: 'Attendance Lookup Failed',
				})
			);

		if (existing) {
			// Update existing record
			Object.assign(existing, createAttendanceDto);
			return await this.attendanceRepository.save(existing).catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/attendance/attendance.service.ts',
					functionName: 'create',
					errorStatusObject: BadRequestException,
					message: `Failed to update existing attendance for student ${createAttendanceDto.studentId}`,
					title: 'Attendance Update Failed',
				})
			);
		}

		// Create new record
		const attendance = this.attendanceRepository.create({
			...createAttendanceDto,
			lessonId: lesson.id,
			studentId: student.id,
		});
		return await this.attendanceRepository.save(attendance).catch((error) =>
			errorHandler(error, {
				filePath: 'backend/src/attendance/attendance.service.ts',
				functionName: 'create',
				errorStatusObject: BadRequestException,
				message: `Failed to create attendance for student ${createAttendanceDto.studentId} in lesson ${createAttendanceDto.lessonId}`,
				title: 'Attendance Creation Failed',
			})
		);
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

		return await this.attendanceRepository
			.find({
				where,
				relations: {
					lesson: true,
					student: true,
				},
				order: { date: 'DESC' },
			})
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/attendance/attendance.service.ts',
					functionName: 'findAll',
					message: `Failed to fetch attendance records with filters: ${JSON.stringify(query)}`,
					title: 'Attendance Query Failed',
				})
			);
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

		return await this.attendanceRepository
			.find({
				where,
				relations: ['lesson'],
				order: { date: 'DESC' },
			})
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/attendance/attendance.service.ts',
					functionName: 'findByStudent',
					message: `Failed to fetch attendance for student ${studentId}`,
					title: 'Student Attendance Query Failed',
				})
			);
	}

	async update(
		id: string,
		updateAttendanceDto: UpdateAttendanceDto
	): Promise<Attendance> {
		const attendance = await this.attendanceRepository
			.findOne({ where: { uuid: id } })
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/attendance/attendance.service.ts',
					functionName: 'update',
					errorStatusObject: NotFoundException,
					message: `Failed to find attendance record with ID: ${id}`,
					title: 'Attendance Lookup Failed',
				})
			);

		if (!attendance) {
			throw new NotFoundException(`Attendance record with ID ${id} not found`);
		}

		Object.assign(attendance, updateAttendanceDto);
		return await this.attendanceRepository.save(attendance).catch((error) =>
			errorHandler(error, {
				filePath: 'backend/src/attendance/attendance.service.ts',
				functionName: 'update',
				errorStatusObject: BadRequestException,
				message: `Failed to update attendance record ${id}`,
				title: 'Attendance Update Failed',
			})
		);
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

		const student = await this.studentRepository
			.findOne({ where: { uuid: studentId } })
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/attendance/attendance.service.ts',
					functionName: 'markAbsentForFullDay',
					errorStatusObject: NotFoundException,
					message: `Student not found: ${studentId}`,
					title: 'Student Lookup Failed',
				})
			);

		if (!student) {
			throw new NotFoundException(`Student with ID "${studentId}" not found`);
		}

		// Find all lessons for this student on the given date
		const lessons = await this.findLessonsForStudentOnDate(studentId, date);

		if (lessons.length === 0) {
			throw new NotFoundException(
				`No lessons found for student ${studentId} on date ${date}`
			);
		}

		// Create or update attendance for each lesson
		const attendanceRecords: Attendance[] = [];

		for (const lesson of lessons) {
			const existing = await this.attendanceRepository
				.findOne({
					where: {
						lessonId: lesson.id,
						studentId: student.id,
					},
				})
				.catch((error) =>
					errorHandler(error, {
						filePath: 'backend/src/attendance/attendance.service.ts',
						functionName: 'markAbsentForFullDay',
						message: `Failed to check attendance for lesson ${lesson.id}`,
						title: 'Attendance Check Failed',
					})
				);

			if (existing) {
				// Update existing record
				existing.status = AttendanceStatus.ABSENT;
				existing.isJustified = isJustified || false;
				existing.comment = comment || `Marked absent for full day`;
				existing.date = new Date(date);
				attendanceRecords.push(
					await this.attendanceRepository.save(existing).catch((error) =>
						errorHandler(error, {
							filePath: 'backend/src/attendance/attendance.service.ts',
							functionName: 'markAbsentForFullDay',
							errorStatusObject: BadRequestException,
							message: `Failed to update attendance for lesson ${lesson.id}`,
							title: 'Attendance Update Failed',
						})
					)
				);
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
					await this.attendanceRepository.save(newAttendance).catch((error) =>
						errorHandler(error, {
							filePath: 'backend/src/attendance/attendance.service.ts',
							functionName: 'markAbsentForFullDay',
							errorStatusObject: BadRequestException,
							message: `Failed to create attendance for lesson ${lesson.id}`,
							title: 'Attendance Creation Failed',
						})
					)
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
		return await this.lessonRepository
			.createQueryBuilder('lesson')
			.innerJoin('lesson.class', 'class')
			.innerJoin('class.students', 'student')
			.where('student.uuid = :studentId', { studentId })
			.andWhere('lesson.date = :date', { date })
			.getMany()
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/attendance/attendance.service.ts',
					functionName: 'findLessonsForStudentOnDate',
					message: `Failed to find lessons for student ${studentId} on ${date}`,
					title: 'Lesson Query Failed',
				})
			);
	}

	async remove(id: string): Promise<void> {
		const attendance = await this.attendanceRepository
			.findOne({ where: { uuid: id } })
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/attendance/attendance.service.ts',
					functionName: 'remove',
					errorStatusObject: NotFoundException,
					message: `Failed to find attendance record with ID: ${id}`,
					title: 'Attendance Lookup Failed',
				})
			);

		if (!attendance) {
			throw new NotFoundException(`Attendance record with ID ${id} not found`);
		}

		await this.attendanceRepository.delete(attendance.id).catch((error) =>
			errorHandler(error, {
				filePath: 'backend/src/attendance/attendance.service.ts',
				functionName: 'remove',
				errorStatusObject: BadRequestException,
				message: `Failed to delete attendance record ${id}`,
				title: 'Attendance Deletion Failed',
			})
		);
	}
}
