import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMs } from 'mongoose';
import { User } from 'src/user/user.model';
import { PetProduct } from 'src/product/product.model';

export type AgentDocument = HydratedDocument<Agent>;

@Schema({ timestamps: true })
export class Agent {
  @Prop()
  socialMedia: string;

  @Prop({
    type: SchemaMs.Types.ObjectId,
    ref: 'User',
  })
  author: User;

  @Prop({ default: false })
  approved: boolean;

  @Prop([{ type: SchemaMs.Types.ObjectId, ref: 'PetProduct' }])
  petProducts: PetProduct[];
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
