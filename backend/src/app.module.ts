import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { GradesModule } from './grades/grades.module';
import { EventsModule } from './events/events.module';
import { ReportCardsModule } from './report-cards/report-cards.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { User } from './common/entities/user.entity';
import { Student } from './common/entities/student.entity';
import { Class } from './common/entities/class.entity';
import { Lesson } from './common/entities/lesson.entity';
import { Attendance } from './attendance/entities/attendance.entity';
import { Grade } from './grades/entities/grade.entity';
import { CommentTemplate } from './grades/entities/comment-template.entity';
import { EducationalEvent } from './events/entities/educational-event.entity';
import { ReportCard } from './report-cards/entities/report-card.entity';
import { ReportCardLine } from './report-cards/entities/report-card-line.entity';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DATABASE_HOST || 'localhost',
			port: parseInt(process.env.DATABASE_PORT || '5432'),
			username: process.env.DATABASE_USER || 'school_admin',
			password: process.env.DATABASE_PASSWORD || 'school_password',
			database: process.env.DATABASE_NAME || 'school_management',
			entities: [
				User,
				Student,
				Class,
				Lesson,
				Attendance,
				Grade,
				CommentTemplate,
				EducationalEvent,
				ReportCard,
				ReportCardLine,
			],
			synchronize: process.env.NODE_ENV === 'development', // Only in dev
			logging: process.env.NODE_ENV === 'development',
		}),
		TypeOrmModule.forFeature([User, Student, Class, Lesson]),
		AuthModule,
		AttendanceModule,
		GradesModule,
		EventsModule,
		ReportCardsModule,
		DashboardModule,
	],
})
export class AppModule {}
