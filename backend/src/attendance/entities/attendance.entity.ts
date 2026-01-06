import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
	Index,
	Generated,
} from 'typeorm';
import { AttendanceStatus } from '../../common/enums';
import { Student } from '../../common/entities/student.entity';
import { Lesson } from '../../common/entities/lesson.entity';

@Entity('attendances')
@Index(['lessonId', 'studentId'], { unique: true })
export class Attendance {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Generated('uuid')
	uuid: string;

	@Column({ name: 'lesson_id' })
	lessonId: number;

	@Column({ name: 'student_id' })
	studentId: number;

	@Column({ type: 'date' })
	date: Date;

	@Column({
		type: 'enum',
		enum: AttendanceStatus,
		default: AttendanceStatus.PRESENT,
	})
	status: AttendanceStatus;

	@Column({ name: 'is_justified', default: false })
	isJustified: boolean;

	@Column({ type: 'text', nullable: true })
	comment: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	// Relations
	@ManyToOne(() => Lesson, (lesson) => lesson.attendances)
	@JoinColumn({ name: 'lesson_id' })
	lesson: Lesson;

	@ManyToOne(() => Student, (student) => student.attendances)
	@JoinColumn({ name: 'student_id' })
	student: Student;
}
