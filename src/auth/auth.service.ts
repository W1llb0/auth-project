import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { Users } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { TokenExpiredError } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import * as cron from 'node-cron';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaClient, private jwtService: JwtService) {
    this.prisma = new PrismaClient();
    //'*/10 * * * * *'
    cron.schedule('0 0 * * *', () => {
      this.deleteExpiredTokens();
    });
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
    }); // уменьшить

    return user;
  }

  async deleteUser(id: number) {
    await this.prisma.users.delete({
      where: {
        id: id,
      },
    });
  }

  async generateTokenPair(
    user: Users,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { email: user.email, sub: user.id };

    const createToken = async (secret: string, expiresIn: string) =>
      this.jwtService.signAsync(
        { ...payload, jti: uuidv4() },
        { secret, expiresIn },
      );

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

  async addToJwtRefreshTokens(token: string): Promise<void> {
    try {
      const secret = process.env.JWT_REFRESH_SECRET;
      const payload = jwt.verify(token, secret) as JwtPayload;
      const expiryDate = new Date(payload.exp * 1000);
      await this.prisma.jwtRefreshTokens.create({
        data: {
          token: token,
          expiryDate: expiryDate,
        },
      });
    } catch (e) {
      console.error('Failed to add token to JwtBlackList', e);
    }
  }

  async deleteFromJwtRefreshTokens(token: string) {
    await this.prisma.jwtRefreshTokens.delete({
      where: {
        token: token,
      },
    });
  }

  async isTokenInJwtRefreshTokens(token: string): Promise<boolean> {
    try {
      if (!token) {
        console.error('Failed to decode token in JwtBlackList');
        return false;
      }

      const findToken = await this.prisma.jwtRefreshTokens.findUnique({
        where: { token: token },
      });

      return !!findToken;
    } catch (e) {
      console.error('Failed to check token in JwtBlackList', e);
      return false;
    }
  }

  async deleteExpiredTokens() {
    const currentDateTime = new Date();

    try {
      await this.prisma.jwtRefreshTokens.deleteMany({
        where: {
          expiryDate: {
            lte: currentDateTime,
          },
        },
      });
    } catch (error) {
      console.error('Error deleting expired tokens:', error);
    }
  }
}
