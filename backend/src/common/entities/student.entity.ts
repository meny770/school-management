import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	JoinColumn,
	Generated,
} from 'typeorm';
import { Class } from './class.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Grade } from '../../grades/entities/grade.entity';
import { EducationalEvent } from '../../events/entities/educational-event.entity';
import { ReportCard } from '../../report-cards/entities/report-card.entity';

@Entity('students')
export class Student {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Generated('uuid')
	uuid: string;

	@Column({ name: 'first_name', length: 100 })
	firstName: string;

	@Column({ name: 'last_name', length: 100 })
	lastName: string;

	@Column({ name: 'class_id', nullable: true })
	classId: number;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	// Relations
	@ManyToOne(() => Class, (classEntity) => classEntity.students, {
		nullable: true,
	})
	@JoinColumn({ name: 'class_id' })
	class: Class;

	@OneToMany(() => Attendance, (attendance) => attendance.student)
	attendances: Attendance[];

	@OneToMany(() => Grade, (grade) => grade.student)
	grades: Grade[];

	@OneToMany(() => EducationalEvent, (event) => event.student)
	events: EducationalEvent[];

	@OneToMany(() => ReportCard, (reportCard) => reportCard.student)
	reportCards: ReportCard[];

	// Virtual property
	get fullName(): string {
		return `${this.firstName} ${this.lastName}`;
	}
}
