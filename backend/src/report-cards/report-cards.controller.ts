import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportCardsService } from './report-cards.service';
import {
  CreateReportCardDto,
  AddReportCardLinesDto,
  GetReportCardsQueryDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('report-cards')
@UseGuards(JwtAuthGuard)
export class ReportCardsController {
  constructor(private readonly reportCardsService: ReportCardsService) {}

  @Post()
  create(@Body() createReportCardDto: CreateReportCardDto) {
    return this.reportCardsService.create(createReportCardDto);
  }

  @Post(':id/lines')
  addLines(
    @Param('id') id: string,
    @Body() addLinesDto: AddReportCardLinesDto,
  ) {
    return this.reportCardsService.addLines(id, addLinesDto);
  }

  @Get()
  findAll(@Query() query: GetReportCardsQueryDto) {
    return this.reportCardsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportCardsService.findOne(id);
  }

  @Put(':id/publish')
  publish(@Param('id') id: string) {
    return this.reportCardsService.publish(id);
  }
}

