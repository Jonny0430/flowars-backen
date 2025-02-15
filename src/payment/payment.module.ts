import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from 'nestjs-stripe';
import { CustomerModule } from 'src/customer/customer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.model';
import { CustomerService } from 'src/customer/customer.service';
import { PetProduct, PetProductSchema } from 'src/product/product.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CustomerModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: PetProduct.name,
        schema: PetProductSchema,
      },
    ]),
    StripeModule.forRoot({
      apiKey: process.env.STRIPE_SECRET_KEY,
      apiVersion: '2022-11-15',
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, CustomerService],
})
export class PaymentModule {}
