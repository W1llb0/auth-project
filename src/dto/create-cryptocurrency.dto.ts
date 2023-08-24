import { IsInt, IsNotEmpty, IsString, IsBoolean, IsOptional, IsISO8601, IsObject } from 'class-validator';

export class CreateCryptocurrencyDto {
  @IsNotEmpty()
  @IsInt()
  rank: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  symbol: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsInt()
  is_active: number;

  @IsNotEmpty()
  @IsISO8601()
  first_historical_data: Date;

  @IsNotEmpty()
  @IsISO8601()
  last_historical_data: Date;

  // `platform` должно быть необязательным, так как тип поля Json может быть null или объектом
  @IsOptional()
  @IsObject()
  platform: object;
}
