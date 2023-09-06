import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.header('Authorization')?.split(' ')[1];

      if (accessToken) {
        await this.jwtService.verifyAsync(accessToken);
      } else {
        throw new Error('No access token found');
      }
    } catch (err) {
      const refreshToken = req.cookies['refresh token'];

      if (refreshToken) {
        try {
          const { access_token: newAccessToken, refresh_token: newRefreshToken } = await this.authService.refreshTokens(
            refreshToken,
          );

          res.cookie('refresh token', newRefreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          req.headers.authorization = `Bearer ${newAccessToken}`;
        } catch (refreshErr) {
          next();
          return;
        }
      } else {
        next();
        return;
      }
    }

    next();
  }
}
