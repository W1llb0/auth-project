import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { UserService } from './users/users.service';
// import { LocalStrategy } from './auth/local.strategy';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import * as cookieParser from 'cookie-parser';
// import { JwtCookieMiddleware } from './auth/jwt-cookie.middleware';
// import { JwtCheckMiddleware } from './auth/jwt-check.middleware';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
// import { CryptoController } from './crypto/map/crypto.controller';
// import { CryptoService } from './crypto/map/crypto.service';
// import { ListingsLatestController } from './crypto/listings-latest/listings-latest.controller';
// import { ListingsLatestService } from './crypto/listings-latest/listings-latest.service';
import { CoursesController } from './courses/courses.controller';
import { CoursesModule } from './courses/courses.module';
import { RefreshMiddleware } from './auth/middlewares/refresh.middleware';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    AuthModule,
    CoursesModule,
  ],
  controllers: [
    AppController,
    //  CryptoController,
    // ListingsLatestController,
  ],
  providers: [
    UserService,
    JwtStrategy,
    AuthService,
    JwtAuthGuard,
    PrismaService,
    // CryptoService,
    // ListingsLatestService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser.default()).forRoutes('*');
    // consumer.apply(JwtCookieMiddleware).forRoutes('api/auth');
    // consumer.apply(JwtCheckMiddleware).forRoutes('api/allUsers');
    // consumer.apply(JwtRefreshMiddleware).exclude('api/auth').forRoutes('*');
    consumer.apply(RefreshMiddleware).forRoutes('api/courses');
  }
}
