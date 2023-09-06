import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, Courses } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaClient) {}

  async getCourseList(): Promise<Courses[]> {
    return this.prisma.courses.findMany();
  }

  async getCourseById(id: number): Promise<Courses | null> {
    return this.prisma.courses.findUnique({ where: { id } });
  }
}
