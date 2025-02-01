import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Agent, AgentDocument } from 'src/agent/agent.model'
import { PetProduct, ProductDocument } from 'src/product/product.model'
import { User, UserDocument } from 'src/user/user.model'
import { DeleteProductDto } from './admin.dto'

@Injectable()
export class AdminService {
	constructor(
		@InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectModel(PetProduct.name) private productModel: Model<ProductDocument>
	) {}

	public async getAllAgents() {
		const agents = await this.agentModel.find().populate('author').exec()

		return agents.map(agent => this.getSpecificField(agent))
	}

	public async approveAgent(agentId: string) {
		const agent = await this.agentModel.findByIdAndUpdate(agentId, { $set: { approved: true } }, { new: true })

		await this.userModel.findByIdAndUpdate(
			agent?.author,
			{
				$set: { role: 'AGENT' }
			},
			{ new: true }
		)

		return 'Success'
	}

	public async deleteAgent(agentId: string) {
		const agent = await this.agentModel.findByIdAndUpdate(agentId, { $set: { approved: false } }, { new: true })

		await this.userModel.findByIdAndUpdate(agent.author, { $set: { role: 'USER' } }, { new: true })

		return 'Success'
	}

	public async getAllUsers(limit: number) {
		const users = await this.userModel.find().limit(limit).sort({ createdAt: -1 }).exec()

		return users.map(user => this.getUserSpecificField(user))
	}

	public async searchUser(email: string, limit: number) {
		let users: UserDocument[]
		if (email) {
			users = await this.userModel.find({}).exec()
		} else {
			users = await this.userModel.find({}).limit(limit).exec()
		}

		const searchedUser = users.filter(user => user.email.toLowerCase().indexOf(email.toLowerCase()) !== -1)

		return searchedUser.map(user => this.getUserSpecificField(user))
	}

	public async deleteProduct(productId: string) {
		const productAuthor = await this.productModel.findById(productId)
		await this.agentModel.findOneAndUpdate(
			{ author: productAuthor?.author },
			{ $pull: { product: productId } },
			{ new: true }
		)
		await this.productModel.findByIdAndRemove(productId, { new: true }).exec()
		const products = await this.productModel.find().exec()
		return products.map(product => this.getSpecificFieldProduct(product))
	}

	getUserSpecificField(user: UserDocument) {
		return {
			email: user.email,
			fullName: user.fullName,
			_id: user._id,
			role: user.role,
			createdAt: user.createdAt
		}
	}

	getSpecificField(agent: AgentDocument) {
		return {
			approved: agent.approved,
			socialMedia: agent.socialMedia,
			_id: agent._id,
			author: {
				fullName: agent.author?.fullName,
				email: agent.author?.email
			}
		}
	}

	getSpecificFieldProduct(product: ProductDocument) {
		return {
			productName: product.productName,
			image: product.image,
			price: product.price,
			isActive: product.isActive,
			_id: product._id
		}
	}
}
