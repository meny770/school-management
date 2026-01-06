import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
	Generated,
} from 'typeorm';
import { ReportCard } from './report-card.entity';

@Entity('report_card_lines')
export class ReportCardLine {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Generated('uuid')
	uuid: string;

	@Column({ name: 'report_card_id' })
	reportCardId: number;

	@Column({ length: 100 })
	subject: string;

	@Column({ name: 'final_grade', type: 'decimal', precision: 5, scale: 2 })
	finalGrade: number;

	@Column({ type: 'text', nullable: true })
	comments: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	// Relations
	@ManyToOne(() => ReportCard, (reportCard) => reportCard.lines)
	@JoinColumn({ name: 'report_card_id' })
	reportCard: ReportCard;
}
