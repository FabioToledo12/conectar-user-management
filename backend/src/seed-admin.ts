import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './users/entities/user.entity';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: process.cwd() + '/.env' });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'conectar_db',
  entities: [User],
  synchronize: false,
});

async function seedAdmin() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);

  const email = 'admin@conectar.com';
  const password = 'admin123';
  const name = 'Admin';

  let user = await userRepo.findOne({ where: { email } });
  if (user) {
    if (user.role !== UserRole.ADMIN) {
      user.role = UserRole.ADMIN;
      await userRepo.save(user);
    }
  } else {
    const hashed = await bcrypt.hash(password, 10);
    user = userRepo.create({
      name,
      email,
      password: hashed,
      role: UserRole.ADMIN,
      isActive: true,
    });
    await userRepo.save(user);
  }
  await AppDataSource.destroy();
}

seedAdmin().catch((err) => {
  console.error('Erro ao criar admin:', err);
  process.exit(1);
}); 