import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Nome completo do usuário',
    example: 'João Silva' 
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ 
    description: 'Email único do usuário',
    example: 'joao@exemplo.com' 
  })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({ 
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'senha123' 
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    required: false,
    default: UserRole.USER 
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}