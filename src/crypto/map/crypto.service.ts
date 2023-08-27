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
    cron.schedule('0 * * * *', () =>{
    // каждые 10 секунд
    // cron.schedule('*/10 * * * * *', () =>{ 
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

    const numberOfProperties = Object.keys(response.data).length;
    // console.log(numberOfProperties);

    await this.prisma.cryptocurrency.deleteMany();

    await this.prisma.cryptocurrency.createMany({
      data: response.data,
    });

    const addedCryptocurrencies = await this.prisma.cryptocurrency.findMany({});

    // if (cryptocurrencies.length !== addedCryptocurrencies.length) {
    //   console.log('Some IDs are missing!');

    //   const addedCryptocurrencyIds = new Set(
    //     addedCryptocurrencies.map((crypto) => crypto.id),
    //   );
    //   const missingCryptocurrencies = cryptocurrencies.filter(
    //     (crypto) => !addedCryptocurrencyIds.has(crypto.id),
    //   );

    //   console.log('Missing cryptocurrencies:', missingCryptocurrencies);
    // } else {
    //   console.log('All cryptocurrencies have been added.');
    // }

    return addedCryptocurrencies;
  }

  
  
}