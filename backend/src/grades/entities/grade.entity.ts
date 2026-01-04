import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { Student } from '../../common/entities/student.entity';
import { User } from '../../common/entities/user.entity';

@Entity('grades')
export class Grade {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'student_id' })
	studentId: string;

	@Column({ length: 100 })
	subject: string;

	@Column({ name: 'grade_value', type: 'decimal', precision: 5, scale: 2 })
	gradeValue: number;

	@Column({ name: 'meets_expectations', type: 'int', nullable: true })
	meetsExpectations: number | null; // 1-5 scale

	@Column({ name: 'comment_template_ids', type: 'text', nullable: true })
	commentTemplateIds: string | null; // JSON array as string

	@Column({ name: 'custom_comment', type: 'text', nullable: true })
	customComment: string | null;

	@Column({ name: 'strength_note', type: 'text', nullable: true })
	strengthNote: string | null;

	@Column({ name: 'improvement_note', type: 'text', nullable: true })
	improvementNote: string | null;

	@Column({ name: 'teacher_id' })
	teacherId: string;

	@Column({ type: 'date' })
	date: Date;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	// Relations
	@ManyToOne(() => Student, (student) => student.grades)
	@JoinColumn({ name: 'student_id' })
	student: Student;

	@ManyToOne(() => User, (user) => user.grades)
	@JoinColumn({ name: 'teacher_id' })
	teacher: User;
}
