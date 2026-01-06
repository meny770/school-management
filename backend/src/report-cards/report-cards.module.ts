import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportCardsService } from './report-cards.service';
import { ReportCardsController } from './report-cards.controller';
import { ReportCard } from './entities/report-card.entity';
import { ReportCardLine } from './entities/report-card-line.entity';

import { Student } from '../common/entities/student.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ReportCard, ReportCardLine, Student])],
	controllers: [ReportCardsController],
	providers: [ReportCardsService],
	exports: [ReportCardsService],
})
export class ReportCardsModule {}
