import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
	type: 'postgres',
	host: process.env.DATABASE_HOST || 'localhost',
	port: parseInt(process.env.DATABASE_PORT || '5432'),
	username: process.env.DATABASE_USER || 'school_admin',
	password: process.env.DATABASE_PASSWORD || 'school_password',
	database: process.env.DATABASE_NAME || 'school_management',
	entities: ['src/**/*.entity.ts', 'src/**/**/*.entity.js'],
	migrations: ['src/migrations/*.ts', 'src/**/**/*.migration.js'],
	synchronize: true, // Set to false in production, use migrations instead
	logging: process.env.NODE_ENV === 'development',
});
