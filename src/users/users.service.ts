import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService) {}

  async create(
    dto: CreateUserDto,
  ): Promise<{ user: User; access_token: string }> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = new User();
    user.email = dto.email;
    user.password = hashedPassword;

    const userExists = await this.findOneByEmail(dto.email);

    if (userExists) {
      throw new BadRequestException('User already exists');
    } else {
      const createdUser = await user.save();

      const payload = { email: createdUser.email, sub: createdUser.id };
      const access_token = this.jwtService.sign(payload);

      return { user: createdUser, access_token };
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return User.findOne({ where: { email } });
  }
}
