import { Module } from '@nestjs/common'
import { CustomerController } from './customer.controller'
import { CustomerService } from './customer.service'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/user/user.model'
import { StripeModule } from 'nestjs-stripe'

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema
			}
		]),
		StripeModule.forRoot({
			apiKey: process.env.STRIPE_SECRET_KEY,
			apiVersion: '2022-11-15'
		})
	],
	controllers: [CustomerController],
	providers: [CustomerService]
})
export class CustomerModule {}
