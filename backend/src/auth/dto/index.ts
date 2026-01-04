import { IsEmail, IsString, IsEnum, MinLength, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../common/enums';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}

export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

