import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportCard } from './entities/report-card.entity';
import { ReportCardLine } from './entities/report-card-line.entity';
import { Student } from '../common/entities/student.entity';
import {
	CreateReportCardDto,
	AddReportCardLinesDto,
	GetReportCardsQueryDto,
} from './dto';
import { ReportCardStatus } from '../common/enums';

@Injectable()
export class ReportCardsService {
	constructor(
		@InjectRepository(ReportCard)
		private reportCardRepository: Repository<ReportCard>,
		@InjectRepository(ReportCardLine)
		private reportCardLineRepository: Repository<ReportCardLine>,
		@InjectRepository(Student)
		private studentRepository: Repository<Student>
	) {}

	async create(createReportCardDto: CreateReportCardDto): Promise<ReportCard> {
		const student = await this.studentRepository.findOne({
			where: { uuid: createReportCardDto.studentId },
		});

		if (!student) {
			throw new NotFoundException(
				`Student with ID "${createReportCardDto.studentId}" not found`
			);
		}

		const reportCard = this.reportCardRepository.create({
			...createReportCardDto,
			studentId: student.id,
		});
		return this.reportCardRepository.save(reportCard);
	}

	async addLines(
		reportCardId: string,
		addLinesDto: AddReportCardLinesDto
	): Promise<ReportCard> {
		const reportCard = await this.reportCardRepository.findOne({
			where: { uuid: reportCardId },
			relations: ['lines'],
		});

		if (!reportCard) {
			throw new NotFoundException(
				`Report card with ID ${reportCardId} not found`
			);
		}

		const lines = addLinesDto.lines.map((lineDto) =>
			this.reportCardLineRepository.create({
				...lineDto,
				reportCardId: reportCard.id,
			})
		);

		await this.reportCardLineRepository.save(lines);

		const reportCardUpdated = await this.reportCardRepository
			.findOne({
				where: { id: reportCard.id },
				relations: ['lines', 'student'],
			})
			.catch(() => {
				throw new NotFoundException(
					`Report card with ID ${reportCardId} not found`
				);
			});

		if (!reportCardUpdated) {
			throw new NotFoundException(
				`Report card with ID ${reportCardId} not found`
			);
		}

		return reportCardUpdated;
	}

	async findAll(query: GetReportCardsQueryDto): Promise<ReportCard[]> {
		const where: any = {};

		if (query.studentId) {
			where.studentId = query.studentId;
		}

		return this.reportCardRepository.find({
			where,
			relations: ['student', 'lines'],
			order: { year: 'DESC', semester: 'DESC' },
		});
	}

	async findOne(id: string): Promise<ReportCard> {
		const reportCard = await this.reportCardRepository.findOne({
			where: { uuid: id },
			relations: ['student', 'lines'],
		});

		if (!reportCard) {
			throw new NotFoundException(`Report card with ID ${id} not found`);
		}

		return reportCard;
	}

	async publish(id: string): Promise<ReportCard> {
		const reportCard = await this.findOne(id);

		reportCard.status = ReportCardStatus.PUBLISHED;
		reportCard.publishedAt = new Date();

		return this.reportCardRepository.save(reportCard);
	}
}
