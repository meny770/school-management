import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportCardsService } from './report-cards.service';
import { ReportCardsController } from './report-cards.controller';
import { ReportCard } from './entities/report-card.entity';
import { ReportCardLine } from './entities/report-card-line.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportCard, ReportCardLine])],
  controllers: [ReportCardsController],
  providers: [ReportCardsService],
  exports: [ReportCardsService],
})
export class ReportCardsModule {}

