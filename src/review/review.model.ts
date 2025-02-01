import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as SchemaMS } from 'mongoose'
import { PetProduct } from 'src/product/product.model'
import { User } from 'src/user/user.model'

export type ReviewDocument = HydratedDocument<Review>

@Schema({ timestamps: true })
export class Review {
	@Prop()
	rating: number

	@Prop()
	summary: string

	@Prop({ type: SchemaMS.Types.ObjectId, ref: 'User' })
	author: User

	@Prop({ type: SchemaMS.Types.ObjectId, ref: 'PetProduct' })
	product: PetProduct
}

export const ReviewSchema = SchemaFactory.createForClass(Review)
