import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './users/users.service';
import { User } from './users/users.model';
import { plainToClass } from 'class-transformer';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithToken } from './auth/request.interface';
import { JwtCookieMiddleware } from './auth/jwt-cookie.middleware';
import { JwtCheckMiddleware } from './auth/jwt-check.middleware';
import { Response } from 'express';
import * as cookieParser from 'cookie-parser';

@Controller('api')
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
  @Post('auth')
  async login(@Request() req, res: Response) {
    const { user, access_token } = await this.authService.login(
      req.body.email,
      req.body.password,
    );
    this.logger.log(`Успешная авторизация для пользователя: ${user.email}`);
    // res.cookie('jwt', access_token, { httpOnly: true });
    return { user, access_token };
  }

  // @UseGuards(AuthGuard('jwt'))
  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtCheckMiddleware)
  @Get('allUsers')
  async getAllUsers(@Request() req: RequestWithToken): Promise<any> {
    const users = await this.authService.getAllUsers();
    // console.log(req.cookies.jwt);
    return { users };
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('refresh')
  // async refreshToken(@Request() req): Promise<any>{
  //   const user = await this.authService.
  // }
}
