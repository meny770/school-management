import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { EducationalEvent } from './entities/educational-event.entity';
import { CreateEducationalEventDto, GetEventsQueryDto } from './dto';

@Injectable()
export class EventsService {
	constructor(
		@InjectRepository(EducationalEvent)
		private eventsRepository: Repository<EducationalEvent>
	) {}

	async create(
		createEventDto: CreateEducationalEventDto,
		teacherId: string
	): Promise<EducationalEvent> {
		const event = this.eventsRepository.create({
			...createEventDto,
			teacherId,
			notifiedTo: createEventDto.notifiedTo
				? JSON.stringify(createEventDto.notifiedTo)
				: undefined,
		});

		return await this.eventsRepository.save(event);
	}

	async findAll(query: GetEventsQueryDto): Promise<EducationalEvent[]> {
		const where: any = {};

		if (query.studentId) {
			where.studentId = query.studentId;
		}

		if (query.teacherId) {
			where.teacherId = query.teacherId;
		}

		if (query.from && query.to) {
			where.date = Between(new Date(query.from), new Date(query.to));
		}

		return await this.eventsRepository.find({
			where,
			relations: ['student', 'teacher'],
			order: { date: 'DESC', createdAt: 'DESC' },
		});
	}

	async findOne(id: string): Promise<EducationalEvent> {
		const event = await this.eventsRepository.findOne({
			where: { id },
			relations: ['student', 'teacher'],
		});

		if (!event) {
			throw new NotFoundException(`EducationalEvent with ID "${id}" not found`);
		}

		return event;
	}
}
