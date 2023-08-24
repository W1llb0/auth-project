import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCryptocurrencyDto } from 'src/dto/create-cryptocurrency.dto';
import { Cryptocurrency, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { HttpService } from '@nestjs/axios';
import * as cron from 'node-cron';

@Injectable()
export class CryptoService {
  constructor(
    private readonly prisma: PrismaService,
    private httpService: HttpService,
  ) {
    // Запускать задачу каждый час
    // cron.schedule('0 * * * *', () =>{
    // каждые 10 секунд
    cron.schedule('*/10 * * * * *', () =>{ 
      console.log('Cron job executed:', new Date());
      this.create()
    });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.cryptocurrency.deleteMany();
  }

  async create(): Promise<Cryptocurrency[]> {
    const response = await this.httpService
      .get(
        'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?CMC_PRO_API_KEY=91cf31e6-fda3-4248-8872-8fca461a857e',
      )
      .toPromise()
      .then((response) => response.data)
      .catch((err) => console.error(err));

    const cryptocurrencies = response.data;

    await this.prisma.cryptocurrency.deleteMany();

    await this.prisma.cryptocurrency.createMany({
      data: cryptocurrencies.map((crypto) => ({
        id: crypto.id,
        rank: crypto.rank,
        name: crypto.name,
        symbol: crypto.symbol,
        slug: crypto.slug,
        is_active: crypto.is_active,
        first_historical_data: dayjs(crypto.date_added).toDate(),
        last_historical_data: dayjs(crypto.date_added).toDate(),
        platform: crypto.platform,
      })),
      skipDuplicates: true,
    });

    const addedCryptocurrencies = await this.prisma.cryptocurrency.findMany({});
    return addedCryptocurrencies;
  }
  
}