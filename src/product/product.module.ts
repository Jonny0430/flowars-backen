import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/user/user.model'
import { PetProduct, PetProductSchema } from './product.model'
import { Agent, AgentSchema } from 'src/agent/agent.model'
import { Review, ReviewSchema } from 'src/review/review.model'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: PetProduct.name, schema: PetProductSchema },
			{ name: Agent.name, schema: AgentSchema },
			{ name: Review.name, schema: ReviewSchema }
		])
	],
	controllers: [ProductController],
	providers: [ProductService]
})
export class ProductModule {}
