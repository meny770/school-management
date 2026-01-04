import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ReportCardStatus } from '../../common/enums';
import { Student } from '../../common/entities/student.entity';
import { ReportCardLine } from './report-card-line.entity';

@Entity('report_cards')
export class ReportCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id' })
  studentId: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  semester: number;

  @Column({
    type: 'enum',
    enum: ReportCardStatus,
    default: ReportCardStatus.DRAFT,
  })
  status: ReportCardStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt: Date;

  // Relations
  @ManyToOne(() => Student, (student) => student.reportCards)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @OneToMany(() => ReportCardLine, (line) => line.reportCard, {
    cascade: true,
  })
  lines: ReportCardLine[];
}

