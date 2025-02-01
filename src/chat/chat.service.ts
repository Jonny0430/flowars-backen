import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Message, MessageDocument } from './message.schema'
import { GetByUserDto } from 'src/review/dto/review.dto'
import { UpdateUserDto } from 'src/user/dto/user.dto'

@Injectable()
export class ChatService {
	constructor(@InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>) {}

	// Xabarni saqlash
	async saveMessage(user: UpdateUserDto) {
		const newMessage = new this.messageModel({
			user
		})
		return newMessage.save()
	}

	// Oxirgi 10 ta xabarni olish
	async getLastMessages() {
		return this.messageModel
			.find()
			.sort({ createdAt: -1 }) // Yangi xabarlarni oldinroq olish
			.limit(10)
			.exec()
	}
}
