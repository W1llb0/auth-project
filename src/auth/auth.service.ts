import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { Users } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaClient, private jwtService: JwtService) {
    this.prisma = new PrismaClient();
  }

  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.users.create({
      data: {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        phone: createUserDto.phone,
        email: createUserDto.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        Passwords: {
          create: {
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        avatar: true,
        role: true,
        status: true,
        verifiedAt: true,
        createdAt: true,
        updatedAt: true,
        facebookId: true,
        vkId: true,
        googleId: true,
        location: true,
        isVerified: true,
        newEmail: true,
        authType: true,
        tutorialDone: true,
        activeCampaignId: true,
        testsEnabled: true,
        amoCRMId: true,
        emailVerified: true,
        phoneVerified: true,
        deviceLimit: true,
        greetingSMSSent: true,
        getCourseId: true,
      },
    });// уменьшить

    return user;
  }

  async generateTokenPair(
    user: Users,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { email: user.email, sub: user.id };

    const createToken = async (secret: string, expiresIn: string) =>
      this.jwtService.signAsync(payload, { secret, expiresIn });

    const [accessToken, refreshToken] = await Promise.all([
      createToken(process.env.JWT_ACCESS_SECRET, '30m'),
      createToken(process.env.JWT_REFRESH_SECRET, '24h'),
    ]);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const userPayload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = await this.prisma.users.findFirst({
        where: { id: userPayload.sub },
      });

      if (!user) throw new UnauthorizedException('User not found');
      
      return this.generateTokenPair(user);
    } catch (error) {
      const message =
        error instanceof TokenExpiredError
          ? 'Refresh token expired'
          : 'Invalid refresh token';
      throw new UnauthorizedException(message);
    }
  }

  async validateUser(email: string, password: string): Promise<Users | null> {
    const user = await this.prisma.users.findFirst({ where: { email } });

    if (user) {
      const storedPassword = await this.prisma.passwords.findFirst({
        where: { userId: user.id },
      });

      const isPasswordValid =
        storedPassword &&
        (await bcrypt.compare(password, storedPassword.password));

      if (isPasswordValid) {
        return user;
      }
    }

    return null;
  }

  async findOrCreateUserWithOAuth2Profile(profileData: {
    firstName: string;
    lastName: string;
    email: string;
    facebookId?: string;
    vkId?: string;
    googleId?: string;
  }): Promise<Users> {
    let user = await this.prisma.users.findFirst({
      where: {
        OR: [
          { facebookId: profileData.facebookId },
          { vkId: profileData.vkId },
          { googleId: profileData.googleId },
        ],
      },
    });

    if (!user) {
      user = await this.prisma.users.create({
        data: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          facebookId: profileData.facebookId,
          vkId: profileData.vkId,
          googleId: profileData.googleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return user;
  }
}
