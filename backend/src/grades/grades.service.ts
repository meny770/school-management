import { Injectable, NotFoundException } from '@nestjs/common';
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
		const teacher = await this.userRepository.findOne({
			where: { uuid: teacherId },
		});

		if (!teacher) {
			throw new NotFoundException(`Teacher with ID "${teacherId}" not found`);
		}

		const student = await this.studentRepository.findOne({
			where: { uuid: createGradeDto.studentId },
		});

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

		return this.gradeRepository.save(grade);
	}

	async findGrades(query: GetGradesQueryDto): Promise<Grade[]> {
		const queryBuilder = this.gradeRepository
			.createQueryBuilder('grade')
			.leftJoinAndSelect('grade.student', 'student')
			.leftJoinAndSelect('grade.teacher', 'teacher');

		if (query.studentId) {
			// Assuming query.studentId is UUID
			queryBuilder.andWhere('student.uuid = :studentId', {
				studentId: query.studentId,
			});
		}

		if (query.classId) {
			// Assuming query.classId is UUID (if we changed Class ID to UUID)
			// But wait, Class ID is also refactored.
			// So we need to join class and check uuid.
			// Student has class relation.
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

		return queryBuilder.orderBy('grade.date', 'DESC').getMany();
	}

	// Comment Templates
	async createCommentTemplate(
		createCommentTemplateDto: CreateCommentTemplateDto
	): Promise<CommentTemplate> {
		const template = this.commentTemplateRepository.create(
			createCommentTemplateDto
		);
		return this.commentTemplateRepository.save(template);
	}

	async findAllCommentTemplates(): Promise<CommentTemplate[]> {
		return this.commentTemplateRepository.find({
			order: { category: 'ASC', text: 'ASC' },
		});
	}

	async findCommentTemplateById(id: string): Promise<CommentTemplate> {
		const template = await this.commentTemplateRepository.findOne({
			where: { uuid: id },
		});

		if (!template) {
			throw new NotFoundException(`Comment template with ID ${id} not found`);
		}

		return template;
	}

	async deleteCommentTemplate(id: string): Promise<void> {
		const template = await this.findCommentTemplateById(id);
		await this.commentTemplateRepository.delete(template.id);
	}
}
