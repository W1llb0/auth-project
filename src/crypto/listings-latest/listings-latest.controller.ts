import { Controller } from '@nestjs/common';
import { Post, Get, Query } from '@nestjs/common';
import { ListingsLatestService } from './listings-latest.service';
import { LatestListing } from '@prisma/client';

@Controller('api')
export class ListingsLatestController {
  constructor(private listingsLatestService: ListingsLatestService) {}

  @Post('listings/latest')
  async fetchData(): Promise<any> {
    return await this.listingsLatestService.fetchLatestListings();
  }

  @Post('listings/latest/delete')
  async deleteAll(): Promise<void> {
    return await this.listingsLatestService.deleteAll();
  }

  @Get('listings/latest')
  async getListings(
    @Query('start') start: string,
    @Query('limit') limit: string,
  ): Promise<LatestListing[]> {
    const parsedStart = parseInt(start, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;

    return this.listingsLatestService.getListingsWithPagination(parsedStart, parsedLimit);
  }
}