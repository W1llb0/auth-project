import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService, private prisma: PrismaClient) {}

  async create(
    dto: CreateUserDto,
  ): Promise<{ user: Users; access_token: string }> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const userExists = await this.findOneByEmail(dto.email);

    if (userExists) {
      throw new BadRequestException('User already exists');
    } else {
      const now = new Date();
      const createdUser = await this.prisma.users.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
      });

      const payload = { email: createdUser.email, sub: createdUser.id };
      const access_token = this.jwtService.sign(payload);

      return { user: createdUser, access_token };
    }
  }

  async findAll(): Promise<Users[]> {
    return this.prisma.users.findMany();
  }

  async findOneByEmail(email: string): Promise<Users | null> {
    return this.prisma.users.findFirst({ where: { email } });
  }
}
