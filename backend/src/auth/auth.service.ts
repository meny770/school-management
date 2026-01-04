import {
	Injectable,
	UnauthorizedException,
	ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../common/entities/user.entity';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private jwtService: JwtService
	) {}

	async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
		// Check if user already exists
		const existingUser = await this.userRepository.findOne({
			where: { email: registerDto.email },
		});

		if (existingUser) {
			throw new ConflictException('User with this email already exists');
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(registerDto.password, 10);

		// Create user
		const user = this.userRepository.create({
			...registerDto,
			password: hashedPassword,
		});

		await this.userRepository.save(user);

		// Generate JWT
		const accessToken = this.generateToken(user);

		return {
			accessToken,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		};
	}

	async login(loginDto: LoginDto): Promise<AuthResponseDto> {
		// Find user
		const user = await this.userRepository.findOne({
			where: { email: loginDto.email },
		});
		console.log(user);

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		console.log(loginDto.password);
		console.log(user.password);
		// Verify password
		// const isPasswordValid = await bcrypt.compare(
		// 	loginDto.password,
		// 	user.password
		// );

		const isPasswordValid = loginDto.password === user.password;
		console.log(isPasswordValid);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Generate JWT
		const accessToken = this.generateToken(user);
		console.log(accessToken);

		return {
			accessToken,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		};
	}

	private generateToken(user: User): string {
		const payload = {
			sub: user.id,
			email: user.email,
			role: user.role,
		};

		return this.jwtService.sign(payload);
	}

	async validateUser(userId: string): Promise<User | null> {
		return this.userRepository.findOne({ where: { id: userId } });
	}
}
