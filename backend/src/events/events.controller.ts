import {
	Controller,
	Get,
	Post,
	Body,
	Query,
	Param,
	UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEducationalEventDto, GetEventsQueryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../common/entities/user.entity';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Post()
	create(
		@Body() createEventDto: CreateEducationalEventDto,
		@CurrentUser() user: User
	) {
		return this.eventsService.create(createEventDto, user.uuid);
	}

	@Get()
	findAll(@Query() query: GetEventsQueryDto) {
		return this.eventsService.findAll(query);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.eventsService.findOne(id);
	}
}
