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
import { RefreshMiddleware } from './middlewares/refresh.middleware';

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
    await this.authService.addToJwtRefreshTokens(tokens.refresh_token);

    res.cookie('access token', tokens.access_token, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    }); // (30 минут)
    res.cookie('refresh token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); // (24 часа)

    return { newUser };
  }

  @Post('deleteUserById')
  async deleteUser() {
    await this.authService.deleteUser(52596);
    return 'удален';
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const tokens = await this.authService.generateTokenPair(req.user);
    await this.authService.addToJwtRefreshTokens(tokens.refresh_token);

    res.cookie('refresh token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); // (24 часа)
    return `access token="${tokens.access_token}"`;
  }

  @UseGuards(RefreshMiddleware)
  @Post('refresh')
  async refresh(
    @Req() req: ExpressRequest & { cookies: { [key: string]: string } },
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const refreshToken = req.cookies['refresh token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const isTokenInJwtRefreshTokens =
      await this.authService.isTokenInJwtRefreshTokens(refreshToken);

    if (isTokenInJwtRefreshTokens) {
      await this.authService.deleteFromJwtRefreshTokens(refreshToken);
    } else {
      throw new UnauthorizedException('Refresh token not found');
    }

    const { access_token: newAccessToken, refresh_token: newRefreshToken } =
      await this.authService.refreshTokens(refreshToken);
    await this.authService.addToJwtRefreshTokens(newRefreshToken);

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
    await this.authService.addToJwtRefreshTokens(tokens.refresh_token);
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

    await this.authService.addToJwtRefreshTokens(tokens.refresh_token);
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
    await this.authService.addToJwtRefreshTokens(tokens.refresh_token);
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

    const isTokenInJwtRefreshTokens =
      await this.authService.isTokenInJwtRefreshTokens(refreshToken);

    if (isTokenInJwtRefreshTokens) {
      await this.authService.deleteFromJwtRefreshTokens(refreshToken);
    }

    res.cookie('refresh token', '', { httpOnly: true, maxAge: 0 });

    return { message: 'Вы успешно вышли из системы' };
  }
}
