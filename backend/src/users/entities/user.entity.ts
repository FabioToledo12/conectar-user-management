import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'ID único do usuário' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nome completo do usuário' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: 'Email único do usuário' })
  @Column({ unique: true, length: 150 })
  email: string;

  @Column()
  password: string;

  @ApiProperty({ 
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    default: UserRole.USER 
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({ description: 'Data do último login' })
  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @ApiProperty({ description: 'Status de ativação do usuário' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Data de criação do usuário' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  @UpdateDateColumn()
  updatedAt: Date;
}