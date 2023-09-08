import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import * as cookieParser from 'cookie-parser';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ newUser: any }> {
    const newUser = await this.authService.createUser(createUserDto);
    const tokens = await this.authService.generateTokenPair(newUser);

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    }); // (30 минут)
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); // (24 часа)

    return { newUser };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const tokens = await this.authService.generateTokenPair(req.user);

    res.cookie('refresh token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); // (24 часа)
    return `access token="${tokens.access_token}"`;
  }

  @Post('refresh')
  async refresh(
    @Req() req: ExpressRequest & { cookies: { [key: string]: string } },
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const refreshToken = req.cookies['refresh token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    await this.authService.addToJwtBlackList(refreshToken, 'refresh');

    const { access_token: newAccessToken, refresh_token: newRefreshToken } =
      await this.authService.refreshTokens(refreshToken);

    res.cookie('refresh token', newRefreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return JSON.stringify({ accessToken: newAccessToken });
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin(): void {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginCallback(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const tokens = await this.authService.generateTokenPair(req.user);
    res.cookie('refresh token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); // (24 часа)
    return `access token="${tokens.access_token}"`;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin(): void {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const tokens = await this.authService.generateTokenPair(req.user);
    res.cookie('refresh token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); // (24 часа)
    return `access token="${tokens.access_token}"`;
  }

  @Get('vk')
  @UseGuards(AuthGuard('vkontakte'))
  vkLogin(): void {}

  @Get('vk/callback')
  @UseGuards(AuthGuard('vkontakte'))
  async vkLoginCallback(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const tokens = await this.authService.generateTokenPair(req.user);
    res.cookie('refresh token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); // (24 часа)
    return `access token="${tokens.access_token}"`;
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const refreshToken = (req as any).cookies['refresh token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const accessToken = req.headers['authorization']?.split(' ')[1];
    if (accessToken) {
      await this.authService.addToJwtBlackList(accessToken, 'access');
    }
    // console.log( await this.authService.isTokenInBlackList(accessToken));

    await this.authService.addToJwtBlackList(refreshToken, 'refresh');
    
    res.cookie('refresh token', '', { httpOnly: true, maxAge: 0 });

    const invalidTokenPayload = { sub: -1, email: 'invalid@example.com' };
    const invalidToken = await this.jwtService.signAsync(invalidTokenPayload, {
      expiresIn: '1s',
    });

    res.header('authorization', `Bearer ${invalidToken}`);

    return { message: 'Вы успешно вышли из системы' };
  }
}
