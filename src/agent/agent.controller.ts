import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentApplyDto } from './agent.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @HttpCode(200)
  @Post('apply')
  public async applyAsAgent(@Body() dto: AgentApplyDto) {
    return await this.agentService.applyAsAgent(dto);
  }

  @HttpCode(200)
  @Get('product-all')
  @Auth('AGENT')
  public async getAllProduct(@User('_id') _id: string) {
    return await this.agentService.getAllProduct(_id);
  }

  @HttpCode(200)
  @Get('product/:slug')
  @Auth('AGENT')
  public async getDetailedProduct(@Param('slug') slug: string) {
    return await this.agentService.getDetailedProduct(slug);
  }

  @HttpCode(200)
  @Get('all')
  public async getAgent() {
    return this.agentService.getAgent();
  }
}
