import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Conéctar User Management API - Funcionando!';
  }
}