import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './user.model'
import { ConfigModule } from '@nestjs/config'
import { StripeModule } from 'nestjs-stripe'

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		StripeModule.forRoot({ apiKey: process.env.STRIPE_SECRET_KEY, apiVersion: '2022-11-15' })
	],
	controllers: [UserController],
	providers: [UserService]
})
export class UserModule {}
