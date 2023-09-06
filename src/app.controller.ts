import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { UserService } from './users/users.service';
import { User } from './users/users.model';
import { plainToClass } from 'class-transformer';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import * as cookieParser from 'cookie-parser';

@Controller('api')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}
}
