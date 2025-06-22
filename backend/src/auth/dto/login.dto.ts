import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    description: 'Email do usuário',
    example: 'admin@conectar.com' 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Senha do usuário',
    example: 'admin123' 
  })
  @IsString()
  @MinLength(6)
  password: string;
}