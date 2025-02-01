import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from 'src/user/user.model'
import { Agent, AgentDocument } from './agent.model'
import { AgentApplyDto } from './agent.dto'
import { PetProduct, ProductDocument } from 'src/product/product.model'

@Injectable()
export class AgentService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
		@InjectModel(PetProduct.name) private petProductModel: Model<ProductDocument>
	) {}

	public async applyAsAgent(dto: AgentApplyDto) {
		const { email, firstName, lastName, socialMedia } = dto
		let user: UserDocument

		const existUser = await this.userModel.findOne({ email })
		user = existUser

		if (!existUser) {
			const newUser = await this.userModel.create({ ...dto, fullName: `${firstName} ${lastName}` })
			user = newUser
		}

		const data = { socialMedia, author: user._id }
		const existAgent = await this.agentModel.findOne({ author: user._id })

		if (existAgent) {
			throw new BadRequestException('Agent with that email already exist in our system')
		}

		await this.agentModel.create(data)

		return 'Success'
	}

	public async getAllProduct(author: string) {
		return await this.petProductModel.find({ author })
	}

	public async getDetailedProduct(slug: string) {
		return await this.petProductModel.findOne({ slug })
	}

	public async getAgent() {
		const agents = await this.agentModel.find({ approved: true }).populate('author').sort({ createdAt: 1 }).exec()

		return agents.map(agent => this.getSpecifFieldAgent(agent))
	}

	getSpecifFieldAgent(agent: AgentDocument) {
		return {
			avatar: agent.author?.avatar,
			fullName: agent.author?.fullName,
			totalProduct: agent.petProducts?.length
		}
	}
}
