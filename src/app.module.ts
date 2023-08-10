import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { UserController } from './users/users.controller';
import { User } from './users/users.model';
import { UserService } from './users/users.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
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
  ],
  controllers: [AppController, UserController],
  providers: [UserService, LocalStrategy],
})
export class AppModule {}
