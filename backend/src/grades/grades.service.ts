import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';
import { CommentTemplate } from './entities/comment-template.entity';
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
		private commentTemplateRepository: Repository<CommentTemplate>
	) {}

	async createGrade(
		createGradeDto: CreateGradeDto,
		teacherId: string
	): Promise<Grade> {
		const grade = this.gradeRepository.create({
			...createGradeDto,
			teacherId,
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
			queryBuilder.andWhere('grade.studentId = :studentId', {
				studentId: query.studentId,
			});
		}

		if (query.classId) {
			queryBuilder.andWhere('student.classId = :classId', {
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
			where: { id },
		});

		if (!template) {
			throw new NotFoundException(`Comment template with ID ${id} not found`);
		}

		return template;
	}

	async deleteCommentTemplate(id: string): Promise<void> {
		const result = await this.commentTemplateRepository.delete(id);
		if (result.affected === 0) {
			throw new NotFoundException(`Comment template with ID ${id} not found`);
		}
	}
}
