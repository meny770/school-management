import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportCard } from './entities/report-card.entity';
import { ReportCardLine } from './entities/report-card-line.entity';
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
		private reportCardLineRepository: Repository<ReportCardLine>
	) {}

	async create(createReportCardDto: CreateReportCardDto): Promise<ReportCard> {
		const reportCard = this.reportCardRepository.create(createReportCardDto);
		return this.reportCardRepository.save(reportCard);
	}

	async addLines(
		reportCardId: string,
		addLinesDto: AddReportCardLinesDto
	): Promise<ReportCard> {
		const reportCard = await this.reportCardRepository.findOne({
			where: { id: reportCardId },
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
				reportCardId: reportCardId,
			})
		);

		await this.reportCardLineRepository.save(lines);

		const reportCardUpdated = await this.reportCardRepository
			.findOne({
				where: { id: reportCardId },
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
			where: { id },
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
