import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: any) {
    // Проверка токена в черном списке:
    const isTokenInBlackList = await this.authService.isTokenInBlackList(
      payload,
    );


    if (isTokenInBlackList) {
      throw new UnauthorizedException('Token is in the black list');
    }

    // Если токен недействителен, вызовется исключение UnauthorizedException, иначе он пропускается и продолжает выполнения.
    return { userId: payload.sub, email: payload.email };
  }
}
