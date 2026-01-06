import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
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
import { errorHandler } from '../utils';

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
		const student = await this.studentRepository
			.findOne({ where: { uuid: createReportCardDto.studentId } })
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/report-cards/report-cards.service.ts',
					functionName: 'create',
					errorStatusObject: NotFoundException,
					message: `Student not found: ${createReportCardDto.studentId}`,
					title: 'Student Lookup Failed',
				})
			);

		if (!student) {
			throw new NotFoundException(
				`Student with ID "${createReportCardDto.studentId}" not found`
			);
		}

		const reportCard = this.reportCardRepository.create({
			...createReportCardDto,
			studentId: student.id,
		});
		return await this.reportCardRepository.save(reportCard).catch((error) =>
			errorHandler(error, {
				filePath: 'backend/src/report-cards/report-cards.service.ts',
				functionName: 'create',
				errorStatusObject: BadRequestException,
				message: `Failed to create report card for student ${createReportCardDto.studentId}`,
				title: 'Report Card Creation Failed',
			})
		);
	}

	async addLines(
		reportCardId: string,
		addLinesDto: AddReportCardLinesDto
	): Promise<ReportCard> {
		const reportCard = await this.reportCardRepository
			.findOne({
				where: { uuid: reportCardId },
				relations: ['lines'],
			})
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/report-cards/report-cards.service.ts',
					functionName: 'addLines',
					errorStatusObject: NotFoundException,
					message: `Report card not found: ${reportCardId}`,
					title: 'Report Card Lookup Failed',
				})
			);

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

		await this.reportCardLineRepository.save(lines).catch((error) =>
			errorHandler(error, {
				filePath: 'backend/src/report-cards/report-cards.service.ts',
				functionName: 'addLines',
				errorStatusObject: BadRequestException,
				message: `Failed to save report card lines for ${reportCardId}`,
				title: 'Report Card Lines Creation Failed',
			})
		);

		const reportCardUpdated = await this.reportCardRepository
			.findOne({
				where: { id: reportCard.id },
				relations: ['lines', 'student'],
			})
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/report-cards/report-cards.service.ts',
					functionName: 'addLines',
					errorStatusObject: NotFoundException,
					message: `Failed to reload report card: ${reportCardId}`,
					title: 'Report Card Reload Failed',
				})
			);

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

		return await this.reportCardRepository
			.find({
				where,
				relations: ['student', 'lines'],
				order: { year: 'DESC', semester: 'DESC' },
			})
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/report-cards/report-cards.service.ts',
					functionName: 'findAll',
					message: `Failed to fetch report cards with filters: ${JSON.stringify(query)}`,
					title: 'Report Cards Query Failed',
				})
			);
	}

	async findOne(id: string): Promise<ReportCard> {
		const reportCard = await this.reportCardRepository
			.findOne({
				where: { uuid: id },
				relations: ['student', 'lines'],
			})
			.catch((error) =>
				errorHandler(error, {
					filePath: 'backend/src/report-cards/report-cards.service.ts',
					functionName: 'findOne',
					errorStatusObject: NotFoundException,
					message: `Failed to find report card: ${id}`,
					title: 'Report Card Lookup Failed',
				})
			);

		if (!reportCard) {
			throw new NotFoundException(`Report card with ID ${id} not found`);
		}

		return reportCard;
	}

	async publish(id: string): Promise<ReportCard> {
		const reportCard = await this.findOne(id);

		reportCard.status = ReportCardStatus.PUBLISHED;
		reportCard.publishedAt = new Date();

		return await this.reportCardRepository.save(reportCard).catch((error) =>
			errorHandler(error, {
				filePath: 'backend/src/report-cards/report-cards.service.ts',
				functionName: 'publish',
				errorStatusObject: BadRequestException,
				message: `Failed to publish report card: ${id}`,
				title: 'Report Card Publication Failed',
			})
		);
	}
}
