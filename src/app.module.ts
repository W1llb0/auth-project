import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { UserController } from './users/users.controller';
import { User } from './users/users.model';
import { UserService } from './users/users.service';
import { LocalStrategy } from './auth/local.strategy';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { RefreshTokenStrategy } from './auth/refresh-token.strategy';
import { AccessTokenStrategy } from './auth/access-token.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import * as cookieParser from 'cookie-parser';
import { JwtCookieMiddleware } from './auth/jwt-cookie.middleware';
import { JwtCheckMiddleware } from './auth/jwt-check.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'auth-project',
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([User]),
    AuthModule,
  ],
  controllers: [AppController, UserController],
  providers: [
    UserService,
    LocalStrategy,
    JwtStrategy,
    AuthService,
    JwtAuthGuard,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
    consumer.apply(JwtCookieMiddleware).forRoutes('api/auth');
    consumer.apply(JwtCheckMiddleware).forRoutes('api/allUsers');
    // consumer.apply(JwtRefreshMiddleware).exclude('api/auth').forRoutes('*');
  }
}
