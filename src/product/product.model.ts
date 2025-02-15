import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMS } from 'mongoose';
import { User } from 'src/user/user.model';
// import { Species, Gender, Location, Availability, Category } from './product.enum' // Adjust the import path accordingly

export type ProductDocument = HydratedDocument<PetProduct>;

@Schema({ timestamps: true })
export class PetProduct {
  @Prop({ type: SchemaMS.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop()
  productName: string;

  @Prop()
  species: string;

  @Prop([String])
  requirements: string[];

  @Prop()
  description: string;

  @Prop()
  age: string;

  @Prop()
  gender: string;

  @Prop()
  availability: string;

  @Prop()
  location: string;

  @Prop([String])
  color: string[];

  @Prop()
  category: string;

  @Prop()
  price: number;

  @Prop()
  image: string;

  @Prop({ unique: false })
  slug?: string;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop()
  updatedAt: string;
}

export const PetProductSchema = SchemaFactory.createForClass(PetProduct);
