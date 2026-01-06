import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';
import { CommentTemplate } from './entities/comment-template.entity';
import { User } from '../common/entities/user.entity';
import { Student } from '../common/entities/student.entity';
import {
	CreateGradeDto,
	CreateCommentTemplateDto,
	GetGradesQueryDto,
} from './dto';
import { errorHandler } from '../utils';

@Injectable()
export class GradesService {
	constructor(
		@InjectRepository(Grade)
		private gradeRepository: Repository<Grade>,
		@InjectRepository(CommentTemplate)
		private commentTemplateRepository: Repository<CommentTemplate>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Student)
		private studentRepository: Repository<Student>
	) {}

	async createGrade(
		createGradeDto: CreateGradeDto,
		teacherId: string
	): Promise<Grade> {
		const teacher = await this.userRepository
			.findOne({ where: { uuid: teacherId } })
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/grades/grades.service.ts',
					functionName: 'createGrade',
					errorStatusObject: NotFoundException,
					message: `Teacher not found: ${teacherId}`,
					title: 'Teacher Lookup Failed',
				})
			);

		if (!teacher) {
			throw new NotFoundException(`Teacher with ID "${teacherId}" not found`);
		}

		const student = await this.studentRepository
			.findOne({ where: { uuid: createGradeDto.studentId } })
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/grades/grades.service.ts',
					functionName: 'createGrade',
					errorStatusObject: NotFoundException,
					message: `Student not found: ${createGradeDto.studentId}`,
					title: 'Student Lookup Failed',
				})
			);

		if (!student) {
			throw new NotFoundException(
				`Student with ID "${createGradeDto.studentId}" not found`
			);
		}

		const grade = this.gradeRepository.create({
			...createGradeDto,
			teacherId: teacher.id,
			studentId: student.id,
			commentTemplateIds: createGradeDto.commentTemplateIds
				? JSON.stringify(createGradeDto.commentTemplateIds)
				: undefined,
		});

		return await this.gradeRepository.save(grade).catch((error) =>
			errorHandler(error, {
				filePath: 'backend/src/grades/grades.service.ts',
				functionName: 'createGrade',
				errorStatusObject: BadRequestException,
				message: `Failed to save grade for student ${createGradeDto.studentId} in subject ${createGradeDto.subject}`,
				title: 'Grade Creation Failed',
			})
		);
	}

	async findGrades(query: GetGradesQueryDto): Promise<Grade[]> {
		const queryBuilder = this.gradeRepository
			.createQueryBuilder('grade')
			.leftJoinAndSelect('grade.student', 'student')
			.leftJoinAndSelect('grade.teacher', 'teacher');

		if (query.studentId) {
			queryBuilder.andWhere('student.uuid = :studentId', {
				studentId: query.studentId,
			});
		}

		if (query.classId) {
			queryBuilder
				.leftJoin('student.class', 'class')
				.andWhere('class.uuid = :classId', {
					classId: query.classId,
				});
		}

		if (query.subject) {
			queryBuilder.andWhere('grade.subject = :subject', {
				subject: query.subject,
			});
		}

		return await queryBuilder
			.orderBy('grade.date', 'DESC')
			.getMany()
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/grades/grades.service.ts',
					functionName: 'findGrades',
					message: `Failed to fetch grades with filters: ${JSON.stringify(query)}`,
					title: 'Grades Query Failed',
				})
			);
	}

	// Comment Templates
	async createCommentTemplate(
		createCommentTemplateDto: CreateCommentTemplateDto
	): Promise<CommentTemplate> {
		const template = this.commentTemplateRepository.create(
			createCommentTemplateDto
		);
		return await this.commentTemplateRepository.save(template).catch((error) =>
			errorHandler(error, {
				filePath: 'backend/src/grades/grades.service.ts',
				functionName: 'createCommentTemplate',
				errorStatusObject: BadRequestException,
				message: `Failed to create comment template: ${createCommentTemplateDto.category}`,
				title: 'Comment Template Creation Failed',
			})
		);
	}

	async findAllCommentTemplates(): Promise<CommentTemplate[]> {
		return await this.commentTemplateRepository
			.find({ order: { category: 'ASC', text: 'ASC' } })
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/grades/grades.service.ts',
					functionName: 'findAllCommentTemplates',
					message: 'Failed to fetch comment templates',
					title: 'Comment Templates Query Failed',
				})
			);
	}

	async findCommentTemplateById(id: string): Promise<CommentTemplate> {
		const template = await this.commentTemplateRepository
			.findOne({ where: { uuid: id } })
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/grades/grades.service.ts',
					functionName: 'findCommentTemplateById',
					errorStatusObject: NotFoundException,
					message: `Failed to find comment template: ${id}`,
					title: 'Comment Template Lookup Failed',
				})
			);

		if (!template) {
			throw new NotFoundException(`Comment template with ID ${id} not found`);
		}

		return template;
	}

	async deleteCommentTemplate(id: string): Promise<void> {
		const template = await this.findCommentTemplateById(id);
		await this.commentTemplateRepository.delete(template.id).catch((error) =>
			errorHandler(error, {
				filePath: 'backend/src/grades/grades.service.ts',
				functionName: 'deleteCommentTemplate',
				errorStatusObject: BadRequestException,
				message: `Failed to delete comment template: ${id}`,
				title: 'Comment Template Deletion Failed',
			})
		);
	}
}
