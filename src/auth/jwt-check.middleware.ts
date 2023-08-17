import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class JwtCheckMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: () => void) {
    const jwtToken = req.cookies.jwt;
    if (!jwtToken) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
      const decodedToken = await this.authService.verifyToken(jwtToken);
      req.user = decodedToken;
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = decodedToken.exp - now;
      // console.log(expiresIn); // оставшееся время жизни токена
      const newToken = await this.authService.refreshToken(decodedToken);
      const jopa = res.cookie('jwt', newToken, { httpOnly: true });
      res.cookie('jwt', newToken, { httpOnly: true });
      next();
    } catch (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
  }
}
