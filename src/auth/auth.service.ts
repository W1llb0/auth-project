import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/users.model';
import jwt from 'jsonwebtoken';

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
    const options: JwtSignOptions = { expiresIn: '15m', secret: process.env.JWT_SECRET };

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      access_token: this.jwtService.sign(payload, options),
    };
  }

  async getAllUsers(): Promise<User[]> {
    return await User.findAll();
  }

  async verifyToken(token: string): Promise<any> {
    const decoded = this.jwtService.verify(token);
    return decoded;
  }

  async refreshToken(decodedToken) {
    // Получить данные пользователя из токена
    const userEmail = decodedToken.email;
    const user = await this.usersService.findOneByEmail(userEmail);

    // Сгенерировать новый токен
    const payload = { email: user.email, sub: user.id };
    const options: JwtSignOptions = { expiresIn: '15m', secret: process.env.JWT_SECRET };
    const token = this.jwtService.sign(payload, options);
    // // Обновить токен в базе данных
    // await this.usersService.updateToken(user.id, token);
    return token;
  }

  async generateJwtToken(email: string, id: string): Promise<{ user: any; access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);
    const payload = { email: user.email, sub: user.id };
    const options: JwtSignOptions = { expiresIn: '15m', secret: process.env.JWT_SECRET };
    return { user, access_token: this.jwtService.sign(payload, options) };
  }
}
