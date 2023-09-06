import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

@Module({
  providers: [CoursesService, PrismaClient],
  controllers: [CoursesController],
})
export class CoursesModule {}
