import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Agent, AgentSchema } from 'src/agent/agent.model'
import { User, UserSchema } from 'src/user/user.model'
import { PetProduct, PetProductSchema } from 'src/product/product.model'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Agent.name,
				schema: AgentSchema
			},
			{
				name: User.name,
				schema: UserSchema
			},
			{
				name: PetProduct.name,
				schema: PetProductSchema
			}
		])
	],
	controllers: [AdminController],
	providers: [AdminService]
})
export class AdminModule {}
