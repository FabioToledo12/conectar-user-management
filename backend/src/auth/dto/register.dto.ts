import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
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
}