import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EducationalEvent } from './entities/educational-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EducationalEvent])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}

