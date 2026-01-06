import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	Generated,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../enums';
import { Grade } from '../../grades/entities/grade.entity';
import { EducationalEvent } from '../../events/entities/educational-event.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Generated('uuid')
	uuid: string;

	@Column({ length: 100 })
	name: string;

	@Column({ unique: true, length: 100 })
	email: string;

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.TEACHER,
	})
	role: UserRole;

	@Column()
	@Exclude()
	password: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	// Relations
	@OneToMany(() => Grade, (grade) => grade.teacher)
	grades: Grade[];

	@OneToMany(() => EducationalEvent, (event) => event.teacher)
	events: EducationalEvent[];
}
