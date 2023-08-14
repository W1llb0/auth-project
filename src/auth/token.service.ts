import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.model';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async generateAccessToken(user: User): Promise<string> {
    const payload = { username: user.email, sub: user.id };

    return this.jwtService.signAsync(payload, { expiresIn: '20s' });
  }
}