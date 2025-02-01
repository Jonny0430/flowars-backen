import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as SchemaMS } from 'mongoose'
import { User } from 'src/user/user.model'

export type ArticlesDocument = HydratedDocument<Articles>

@Schema({ timestamps: true })
export class Articles {
	@Prop({ type: SchemaMS.Types.ObjectId, ref: 'User' })
	author: User

	@Prop()
	title: string

	@Prop()
	image: string

	@Prop()
	description: string

	@Prop()
	category: string

	@Prop({ unique: false })
	slug?: string
}

export const ArticlesSchema = SchemaFactory.createForClass(Articles)
