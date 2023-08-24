import { Controller, Post, Body, Get } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CreateCryptocurrencyDto } from 'src/dto/create-cryptocurrency.dto';
import { Cryptocurrency } from '@prisma/client';

@Controller('api')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post('crypto')
  async create(
    @Body() createCryptocurrencyDto: CreateCryptocurrencyDto,
  ): Promise<Cryptocurrency[]> {
    return this.cryptoService.create();
  }

  @Post('delete')
  async deleteAll(): Promise<void> {
    return await this.cryptoService.deleteAll();
  }
}
