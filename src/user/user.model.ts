import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMS } from 'mongoose';
import { RoleUser } from './user.interface';
import { PetProduct } from 'src/product/product.model';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  fullName: string;

  @Prop()
  password: string;

  @Prop({ required: false })
  avatar: string;

  @Prop()
  role: RoleUser;

  @Prop()
  customerId: string;

  @Prop()
  agentAccountId: string;

  @Prop()
  bio: string;

  @Prop()
  job: string;

  @Prop()
  birthday: string;

  @Prop([{ type: SchemaMS.Types.ObjectId, ref: 'PetProduct' }])
  products: PetProduct[];

  @Prop()
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
