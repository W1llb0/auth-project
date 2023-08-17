import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { User } from 'src/users/users.model';

@Injectable()
export class JwtCookieMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: () => void) {
    const token = await this.authService.generateJwtToken(
      req.body.email,
      req.body.password,
    );
    res.cookie('jwt', token['access_token'], { httpOnly: true });
    const jwtToken = req.cookies.jwt;
    next();
  }
}
