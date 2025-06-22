import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, MaxLength, IsBoolean } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ 
    description: 'Status de ativação do usuário',
    required: false 
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateProfileDto {
  @ApiProperty({ 
    description: 'Nome completo do usuário',
    required: false 
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({ 
    description: 'Nova senha do usuário',
    required: false 
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}