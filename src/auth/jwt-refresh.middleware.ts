import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RequestWithToken } from './request.interface';

@Injectable()
export class JwtRefreshMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: RequestWithToken, res: Response, next: NextFunction) {
    console.log('Cookies:', req.cookies);
    const authToken = req.cookies.jwt;
    console.log('AuthToken:', authToken);
    if (authToken) {
      try {
        const payload = await this.jwtService.verifyAsync(authToken);
        const { exp, ...rest } = payload;
        const currentTime = Math.floor(Date.now() / 1000);
        // Разница между временем истечения токена и текущим временем в
        // секундах.
        const timeDiff = exp - currentTime;
        // Время, за которое нужно обновить токен до истечения.
        const refreshTime = 60; // Время в секундах до истечения токена, на которое нужно обновить токен.
        const newPayload = {
            ...rest,
            exp: Math.floor(Date.now() / 1000) + 3600, // +1 час
          };
        if (timeDiff < refreshTime) {
          const newToken = this.jwtService.sign(newPayload);
          const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // Время жизни токена (1 час).
          };
          res.cookie('jwt', newToken, cookieOptions);
          req.newToken = newToken;
        }
      } catch (err) {
        // Обработка ошибок при проверке токена.
      }
    }
    next();
  }
}
