import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  async create(user: User): Promise<User> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return User.create(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    return User.findOne({ where: { email } });
  }
}