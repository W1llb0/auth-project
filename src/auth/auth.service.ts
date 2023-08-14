import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/users.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toJSON();
      return result;
    }
    return null;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: any; access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const payload = { email: user.email, sub: user.id };

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async getAllUsers(): Promise<User[]> {
    return await User.findAll();
  }

  async verifyToken(token: string): Promise<any> {
    const decoded = this.jwtService.verify(token);
    return decoded;
  }
}
