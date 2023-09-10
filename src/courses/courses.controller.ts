import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Courses } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCourseList(): Promise<Courses[]> {
    return this.coursesService.getCourseList();
  }
  
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCourseById(@Param('id') id: string): Promise<Courses | null> {
    const parsedId = parseInt(id, 10);
    return this.coursesService.getCourseById(parsedId);
  }
}
