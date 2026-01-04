import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Lesson } from './lesson.entity';
import { User } from './user.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'grade_level', type: 'int' })
  gradeLevel: number;

  @Column({ name: 'homeroom_teacher_id', nullable: true })
  homeroomTeacherId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'homeroom_teacher_id' })
  homeroomTeacher: User;

  @OneToMany(() => Student, (student) => student.class)
  students: Student[];

  @OneToMany(() => Lesson, (lesson) => lesson.class)
  lessons: Lesson[];
}

