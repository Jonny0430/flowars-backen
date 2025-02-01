import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './user.model'
import { Model } from 'mongoose'
import { InterfaceEmailAndPassword } from './user.interface'
import { genSalt, hash } from 'bcryptjs'
import { InjectStripe } from 'nestjs-stripe'
import Stripe from 'stripe'
import { UpdateUserDto } from './dto/user.dto'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectStripe() private readonly stripeClient: Stripe
	) {}

	public async byId(id: string) {
		const user = await this.userModel.findById(id)

		if (!user) throw new NotFoundException('User not fount')

		return user
	}

	public async editPassword(dto: InterfaceEmailAndPassword) {
		const { email, password } = dto

		const existUser = await this.userModel.findOne({ email })
		if (!existUser) throw new UnauthorizedException('User not found')

		const salt = await genSalt(10)
		const hashPassword = await hash(password, salt)

		await this.userModel.findByIdAndUpdate(existUser._id, { $set: { password: hashPassword } }, { new: true })

		return 'Success'
	}

	async updateUser(body: UpdateUserDto, userId: string) {
		const { avatar, firsName, lastName, bio, birthday, job } = body

		const user = await this.userModel.findByIdAndUpdate(
			userId,
			{
				$set: { fullName: `${firsName} ${lastName}`, avatar, bio, birthday, job }
			},
			{ new: true }
		)

		return user
	}

	async myProducts(userId: string) {
		const user = await this.userModel.findById(userId).populate('products').exec()

		return user.products
	}

	async allTransactions(customerId: string) {
		const transactions = await this.stripeClient.charges.list({
			customer: customerId,
			limit: 100
		})

		return transactions.data
	}
}
