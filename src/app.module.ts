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
import { JwtRefreshMiddleware } from './auth/jwt-refresh.middleware';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '20s' },
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
    JwtRefreshMiddleware,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtRefreshMiddleware).exclude('auth').forRoutes('*');
  }
}
