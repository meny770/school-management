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

@Entity('lessons')
export class Lesson {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Generated('uuid')
	uuid: string;

	@Column({ name: 'class_id' })
	classId: number;

	@Column({ length: 100 })
	subject: string;

	@Column({ type: 'time', name: 'start_time' })
	startTime: string;

	@Column({ type: 'time', name: 'end_time' })
	endTime: string;

	@Column({ type: 'date' })
	date: Date;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	// Relations
	@ManyToOne(() => Class, (classEntity) => classEntity.lessons)
	@JoinColumn({ name: 'class_id' })
	class: Class;

	@OneToMany(() => Attendance, (attendance) => attendance.lesson)
	attendances: Attendance[];
}
