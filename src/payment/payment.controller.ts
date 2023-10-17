import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';

@Controller('api')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  // @Post('buy')
  // async buy(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body() body: any,
  //   @Headers() headers: any,
  // ) {
  //   try {
  //     const result = await this.paymentService.buy(req, body, headers);
  //     res.json(result);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: 'Server error', error: err.message });
  //   }
  // }
}
