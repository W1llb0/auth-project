import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService, private prisma: PrismaClient) {}

  async findAll(): Promise<Users[]> {
    return this.prisma.users.findMany();
  }

  async findOneByEmail(email: string): Promise<Users | null> {
    return this.prisma.users.findFirst({ where: { email } });
  }
}
