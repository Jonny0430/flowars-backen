import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PaymentBooksDto } from './dto/payment-books.dto';
import { User } from 'src/user/decorators/user.decorator';
import { PaymentProductDto } from './dto/payment-product.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @HttpCode(200)
  @Post('books')
  @Auth('USER')
  paymentBooks(@Body() dto: PaymentBooksDto, @User('_id') _id: string) {
    return this.paymentService.paymentBooks(dto, _id);
  }

  @HttpCode(200)
  @Get('list-products')
  listProducts() {
    return this.paymentService.listProducts();
  }

  @HttpCode(200)
  @Post('products')
  @Auth('USER')
  paymentProducts(@Body() dto: PaymentProductDto, @User('_id') _id: string) {
    return this.paymentService.paymentProducts(dto, _id);
  }

  @HttpCode(200)
  @Post('create-subscription')
  @Auth('USER')
  createSubscription(@User('_id') _id: string, @Body() dto: PaymentBooksDto) {
    return this.paymentService.createSubscription(_id, dto);
  }

  @HttpCode(200)
  @Get('agent-balance')
  @Auth('AGENT')
  agentBalance(@User('agentAccountId') agentAccountId: string) {
    return this.paymentService.agentBalance(agentAccountId);
  }

  @HttpCode(200)
  @Post('agent-connect-login')
  @Auth('AGENT')
  agentConnectLogin(@User('agentAccountId') agentAccountId: string) {
    return this.paymentService.agentConnectLogin(agentAccountId);
  }

  @HttpCode(200)
  @Get('apply-coupon/:id')
  @Auth()
  applyCoupon(@Param('id') id: string) {
    return this.paymentService.applyCoupon(id);
  }
}
