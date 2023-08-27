import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CreateCryptocurrencyDto } from 'src/dto/create-cryptocurrency.dto';
import { Cryptocurrency } from '@prisma/client';

@Controller('api')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post('crypto')
  async create(): Promise<Cryptocurrency[]> {
    return this.cryptoService.create();
  }

  @Delete('crypto')
  async delete(){
    return this.cryptoService.deleteAll();
  }
}
