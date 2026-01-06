import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EducationalEvent } from './entities/educational-event.entity';

import { User } from '../common/entities/user.entity';
import { Student } from '../common/entities/student.entity';

@Module({
	imports: [TypeOrmModule.forFeature([EducationalEvent, User, Student])],
	controllers: [EventsController],
	providers: [EventsService],
	exports: [EventsService],
})
export class EventsModule {}
