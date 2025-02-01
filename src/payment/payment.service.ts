import { Injectable } from '@nestjs/common'
import { InjectStripe } from 'nestjs-stripe'
import { CustomerService } from 'src/customer/customer.service'
import Stripe from 'stripe'
import { PaymentBooksDto } from './dto/payment-books.dto'
import { InjectModel } from '@nestjs/mongoose'
import { PetProduct, ProductDocument } from 'src/product/product.model'
import { Model } from 'mongoose'
import { PaymentProductDto } from './dto/payment-product.dto'

@Injectable()
export class PaymentService {
	constructor(
		@InjectStripe() private readonly stripeCLient: Stripe,
		private readonly customerService: CustomerService,
		@InjectModel(PetProduct.name) private productModel: Model<ProductDocument>
	) {}

	async paymentBooks(body: PaymentBooksDto, userId: string) {
		const customer = await this.customerService.getCustomer(userId)
		const card = await this.customerService.atachPaymentMethod(body.paymentMethod, userId)
		const paymentIntent = await this.stripeCLient.paymentIntents.create({
			amount: body.price,
			currency: 'krw',
			payment_method: card.id,
			customer: customer.id
		})

		return paymentIntent.client_secret
	}

	async paymentProducts(body: PaymentProductDto, userId: string) {
		const customer = await this.customerService.getCustomer(userId)
		const card = await this.customerService.atachPaymentMethod(body.paymentMethod, userId)
		const product = await this.productModel.findById(body.productId).populate('author')

		const feePrice = (30 / 100) * body.price

		const paymentIntent = await this.stripeCLient.paymentIntents.create({
			amount: body.price * 100,
			currency: 'usd',
			payment_method: card.id,
			customer: customer.id,
			application_fee_amount: feePrice * 100,
			transfer_data: {
				destination: product.author.agentAccountId
			}
		})

		return paymentIntent.client_secret
	}

	async listProducts() {
		const products = await this.stripeCLient.products.list({
			limit: 3,
			expand: ['data.default_price']
		})
		return products.data
	}

	async createSubscription(userId: string, body: PaymentBooksDto) {
		const customer = await this.customerService.getCustomer(userId)
		const card = await this.customerService.atachPaymentMethod(body.paymentMethod, userId)

		const subscription = await this.stripeCLient.subscriptions.create({
			customer: customer.id,
			items: [{ price: String(body.price) }],
			payment_behavior: 'default_incomplete',
			expand: ['latest_invoice.payment_intent'],
			default_payment_method: card.id,
			trial_period_days: 7
		})

		//@ts-ignore
		return subscription
	}

	async agentBalance(agentAccountId: string) {
		const balances = await this.stripeCLient.balance.retrieve({
			stripeAccount: agentAccountId
		})

		return balances
	}

	async agentConnectLogin(agentAccountId: string) {
		const loginLink = await this.stripeCLient.accounts.createLoginLink(agentAccountId)

		return loginLink
	}

	async applyCoupon(id: string) {
		const coupon = await this.stripeCLient.coupons.retrieve(id)

		return coupon
	}
}
