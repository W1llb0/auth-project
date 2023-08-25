import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { LatestListing, Prisma } from '@prisma/client';
import * as cron from 'node-cron';

@Injectable()
export class ListingsLatestService {
  constructor(private httpService: HttpService, private prisma: PrismaService) {
    // запускать задачу каждые сутки
    cron.schedule('0 0 * * *', () => {
      // Запускать задачу каждый час
      // cron.schedule('0 * * * *', () =>{
      // каждые 10 секунд
      // cron.schedule('*/10 * * * * *', () =>{
      console.log('Cron job executed:', new Date());
      this.fetchLatestListings();
    });
  }

  async fetchLatestListings(): Promise<LatestListing[]> {
    const limit = 5000;
    let start = 1;
    let hasMoreData = true;
    let allData = [];

    while (hasMoreData) {
      try {
        const response = await this.httpService
          .get(
            `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=91cf31e6-fda3-4248-8872-8fca461a857e&limit=${limit}&start=${start}`,
          )
          .toPromise();

        const responseData = response.data.data;
        allData = allData.concat(responseData);

        if (responseData.length < limit) {
          hasMoreData = false;
        } else {
          start += limit;
        }
      } catch (error) {
        console.error(error);
        hasMoreData = false;
      }
    }

    await this.prisma.latestListing.deleteMany();

    const uniqueData = allData.map((listing) => ({
      id: listing.id,
      name: listing.name,
      symbol: listing.symbol,
      slug: listing.slug,
      cmc_rank: listing.cmc_rank,
      num_market_pairs: listing.num_market_pairs,
      circulating_supply: listing.circulating_supply,
      total_supply: listing.total_supply,
      max_supply: listing.max_supply,
      infinite_supply: listing.infinite_supply,
      last_updated: new Date(listing.last_updated),
      date_added: new Date(listing.date_added),
      tags: listing.tags,
      platform: listing.platform,
      self_reported_circulating_supply:
        listing.self_reported_circulating_supply,
      self_reported_market_cap: listing.self_reported_market_cap,
      quote: listing.quote,
    }));

    await this.prisma.latestListing.createMany({
      data: uniqueData,
    });

    const createdListings = await this.prisma.latestListing.findMany();
    return createdListings;
  }

  async deleteAll(): Promise<void> {
    await this.prisma.latestListing.deleteMany();
  }

  async getListingsWithPagination(
    start: number,
    limit: number,
  ): Promise<LatestListing[]> {
    const listings = await this.prisma.latestListing.findMany({
      skip: start - 1,
      take: limit,
      orderBy: {
        cmc_rank: 'asc',
      },
    });
  
    return listings;
  }
}
