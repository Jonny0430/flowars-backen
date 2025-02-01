import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMs } from 'mongoose';
import { User } from 'src/user/user.model';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
    @Prop({ required: true })
    content: string;

    @Prop({
        type: SchemaMs.Types.ObjectId,
        ref: 'User', // 'User' modeli bilan bog‘lanish
        required: false,
    })
    author: User; // Foydalanuvchi obyektini bog‘lash
}

export const MessageSchema = SchemaFactory.createForClass(Message);
