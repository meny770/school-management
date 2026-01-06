import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Generated,
} from 'typeorm';
import { CommentCategory } from '../../common/enums';

@Entity('comment_templates')
export class CommentTemplate {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Generated('uuid')
	uuid: string;

	@Column({
		type: 'enum',
		enum: CommentCategory,
	})
	category: CommentCategory;

	@Column({ type: 'text' })
	text: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
