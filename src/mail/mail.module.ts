import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/user/user.model'
import { MailController } from './mail.controller'
import { MailService } from './mail.service'
import { Otp, OtpSchema } from './otp.model'
import { Books, BooksSchema } from 'src/books/books.model'

@Module({
	imports: [
		ConfigModule,
		MongooseModule.forFeature([
			{ name: Otp.name, schema: OtpSchema },
			{ name: User.name, schema: UserSchema },
			{ name: Books.name, schema: BooksSchema }
		])
	],
	controllers: [MailController],
	providers: [MailService]
})
export class MailModule {}
