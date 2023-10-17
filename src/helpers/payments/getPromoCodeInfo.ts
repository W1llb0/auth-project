import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { servants } from '../config';
import { Config } from 'src/config/index';

@Injectable()
export class PromoCodesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPromoCodeInfo({ promoCode, userId, type, relatedItemId }) {
    try {
      let promoData = null;

      if (promoCode) {
        promoData = await this.prisma.promoCodes.findUnique({
          where: {
            code: promoCode,
          },
        });

        const promoCodeIsValid = await helpers.checkPromoCode(
          promoData,
          userId,
          type,
          relatedItemId,
        );

        if (!promoCodeIsValid) {
          throw new HttpException(
            servants.INVALID_PROMO_CODE,
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      return promoData;
    } catch (e) {
      throw new HttpException(
        e.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
