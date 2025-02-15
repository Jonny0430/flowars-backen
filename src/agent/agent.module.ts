import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.model';
import { Agent, AgentSchema } from './agent.model';
import { PetProduct, PetProductSchema } from 'src/product/product.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Agent.name, schema: AgentSchema },
      { name: PetProduct.name, schema: PetProductSchema },
    ]),
  ],
  providers: [AgentService],
  controllers: [AgentController],
})
export class AgentModule {}
