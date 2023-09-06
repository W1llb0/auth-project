// import { HttpException, Injectable } from '@nestjs/common';
// import { PrismaService } from 'prisma/prisma.service';
// import { CreateCryptocurrencyDto } from 'src/dto/create-cryptocurrency.dto';
// import { Cryptocurrency, Prisma } from '@prisma/client';
// import dayjs from 'dayjs';
// import { HttpService } from '@nestjs/axios';
// import * as cron from 'node-cron';
// import { catchError, lastValueFrom, map } from 'rxjs';
// import { error } from 'console';

// @Injectable()
// export class CryptoService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private httpService: HttpService,
//   ) {
//     // Запускать задачу каждый час
//     cron.schedule('0 * * * *', () => {
//       // каждые 10 секунд
//       // cron.schedule('*/10 * * * * *', () =>{
//       console.log('Cron job executed:', new Date());
//       this.create();
//     });
//   }

//   async deleteAll(): Promise<void> {
//     await this.prisma.cryptocurrency.deleteMany();
//   }

//   async create(): Promise<Cryptocurrency[]> {
//     const response = this.httpService
//       .get(
//         'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?CMC_PRO_API_KEY=91cf31e6-fda3-4248-8872-8fca461a857e',
//       )
//       .pipe(
//         map((response) => {
//           return response.data;
//         }),
//         catchError((error) => {
//           throw new HttpException(error.response.statusText, error.response.status);
//         })
//       );

//     const data = await lastValueFrom(response);

//     await this.prisma.cryptocurrency.deleteMany();

//     await this.prisma.cryptocurrency.createMany({
//       data: data.data,
//     });
//     return data;
//   }
// }
