import { Body, Controller, Get, Request, Post, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './users/users.service';
import { User } from './users/users.model';
import { plainToClass } from 'class-transformer';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('reg')
  async register(@Body() createUserDto: CreateUserDto) {
    const { user, access_token } = await this.userService.create(createUserDto);
    return { user, access_token };
  }

  @UseGuards(LocalAuthGuard)
  @Post('signup')
  async login(@Request() req) {
    const { user, access_token } = await this.authService.login(req.user);
    this.logger.log(`Успешная авторизация для пользователя: ${user.email}`);
    return { user, access_token };
  }
}