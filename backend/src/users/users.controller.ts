import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateProfileDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário (apenas para admins)' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: User })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    // Apenas admins podem criar usuários via esta rota
    if (req.user.role !== UserRole.ADMIN) {
      throw new Error('Apenas administradores podem criar usuários');
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários (apenas para admins)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários', type: [User] })
  @ApiQuery({ name: 'role', enum: UserRole, required: false })
  @ApiQuery({ name: 'sortBy', enum: ['name', 'createdAt'], required: false })
  @ApiQuery({ name: 'order', enum: ['ASC', 'DESC'], required: false })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(
    @Request() req,
    @Query('role') role?: UserRole,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    // Apenas admins podem listar todos os usuários
    if (req.user.role !== UserRole.ADMIN) {
      throw new Error('Apenas administradores podem listar usuários');
    }
    return this.usersService.findAll(role, sortBy, order);
  }

  @Get('inactive')
  @ApiOperation({ summary: 'Listar usuários inativos (sem login nos últimos 30 dias)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários inativos', type: [User] })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findInactiveUsers(@Request() req) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new Error('Apenas administradores podem ver usuários inativos');
    }
    return this.usersService.findInactiveUsers();
  }

  @Get('profile')
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário', type: User })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.sub);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Atualizar perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso', type: User })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.sub, updateProfileDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter usuário por ID' })
  @ApiResponse({ status: 200, description: 'Dados do usuário', type: User })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @Request() req) {
    // Usuários comuns só podem ver seus próprios dados
    if (req.user.role !== UserRole.ADMIN && req.user.sub !== id) {
      throw new Error('Você não tem permissão para ver este usuário');
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso', type: User })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir usuário (apenas para admins)' })
  @ApiResponse({ status: 200, description: 'Usuário excluído com sucesso' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Request() req) {
    return this.usersService.remove(id, req.user);
  }
}