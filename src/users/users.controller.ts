import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './users.model';
import { LocalStrategy } from '../local.strategy';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly localStrategy: LocalStrategy,
  ) {}

  @Post('register')
  async register(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Body() user: User): Promise<User> {
    return user;
  }
}
