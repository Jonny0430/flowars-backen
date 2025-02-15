import { Body, Controller, Delete, Get, HttpCode, Put, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApproveAgentDto, DeleteProductDto } from './admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @HttpCode(200)
  @Get('all-agents')
  @Auth('ADMIN')
  public async getAllAgents() {
    return this.adminService.getAllAgents();
  }

  @HttpCode(200)
  @Put('approve-agent')
  @Auth('ADMIN')
  public async approveAgent(@Body() body: ApproveAgentDto) {
    return this.adminService.approveAgent(body.agentId);
  }

  @HttpCode(200)
  @Put('delete-agent')
  @Auth('ADMIN')
  public async deleteAgent(@Body() body: ApproveAgentDto) {
    return this.adminService.deleteAgent(body.agentId);
  }

  @HttpCode(200)
  @Get('all-users')
  @Auth('ADMIN')
  public getAllUsers(@Query('limit') limit: string) {
    return this.adminService.getAllUsers(Number(limit));
  }

  @HttpCode(200)
  @Get('search-users')
  @Auth('ADMIN')
  public async searchUser(@Query('email') email: string, @Query('limit') limit: string) {
    return this.adminService.searchUser(email, Number(limit));
  }

  @HttpCode(200)
  @Delete('delete-product')
  @Auth('ADMIN')
  public async deleteProduct(@Query('productId') productId: string) {
    return this.adminService.deleteProduct(productId);
  }
}
