import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EventType, EventSeverity } from '../../common/enums';
import { Student } from '../../common/entities/student.entity';
import { User } from '../../common/entities/user.entity';

@Entity('educational_events')
export class EducationalEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id' })
  studentId: string;

  @Column({ name: 'teacher_id' })
  teacherId: string;

  @Column({
    type: 'enum',
    enum: EventType,
    name: 'event_type',
  })
  eventType: EventType;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: EventSeverity,
    default: EventSeverity.LOW,
  })
  severity: EventSeverity;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text', name: 'notified_to', nullable: true })
  notifiedTo: string; // JSON array as string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Student, (student) => student.events)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => User, (user) => user.events)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;
}

