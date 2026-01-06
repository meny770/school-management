import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { EducationalEvent } from './entities/educational-event.entity';
import { User } from '../common/entities/user.entity';
import { Student } from '../common/entities/student.entity';
import { CreateEducationalEventDto, GetEventsQueryDto } from './dto';

@Injectable()
export class EventsService {
	constructor(
		@InjectRepository(EducationalEvent)
		private eventsRepository: Repository<EducationalEvent>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Student)
		private studentRepository: Repository<Student>
	) {}

	async create(
		createEventDto: CreateEducationalEventDto,
		teacherId: string
	): Promise<EducationalEvent> {
		const teacher = await this.userRepository.findOne({
			where: { uuid: teacherId },
		});

		if (!teacher) {
			throw new NotFoundException(`Teacher with ID "${teacherId}" not found`);
		}

		const student = await this.studentRepository.findOne({
			where: { uuid: createEventDto.studentId },
		});

		if (!student) {
			throw new NotFoundException(
				`Student with ID "${createEventDto.studentId}" not found`
			);
		}

		const event = this.eventsRepository.create({
			...createEventDto,
			teacherId: teacher.id,
			studentId: student.id,
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
			where: { uuid: id },
			relations: ['student', 'teacher'],
		});

		if (!event) {
			throw new NotFoundException(`EducationalEvent with ID "${id}" not found`);
		}

		return event;
	}
}
