import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from './users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return user;
      }
    }

    return null;
  }
}
