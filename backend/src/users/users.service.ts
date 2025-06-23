import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateProfileDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const now = new Date();
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      isActive: true,
      lastLogin: now,
    });
    return this.usersRepository.save(user);
  }

  async findAll(role?: UserRole, sortBy?: string, order?: 'ASC' | 'DESC'): Promise<User[]> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    if (role) {
      queryBuilder.where('user.role = :role', { role });
    }
    if (sortBy) {
      const orderBy = sortBy === 'name' ? 'user.name' : 'user.createdAt';
      queryBuilder.orderBy(orderBy, order || 'ASC');
    } else {
      queryBuilder.orderBy('user.createdAt', 'DESC');
    }
    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUser: User): Promise<User> {
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('Você não tem permissão para atualizar este usuário');
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    if (updateProfileDto.password) {
      updateProfileDto.password = await bcrypt.hash(updateProfileDto.password, 10);
    }
    await this.usersRepository.update(id, updateProfileDto);
    return this.findOne(id);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Apenas administradores podem excluir usuários');
    }
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.update(id, { lastLogin: new Date() });
  }

  async findInactiveUsers(): Promise<User[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.lastLogin < :date OR user.lastLogin IS NULL', { date: thirtyDaysAgo })
      .getMany();
  }
}