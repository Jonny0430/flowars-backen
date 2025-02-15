import { Body, Controller, Get, HttpCode, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { InterfaceEmailAndPassword } from './user.interface';
import { UpdateUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  public async getProfile(@User('_id') _id: string) {
    return this.userService.byId(_id);
  }

  @HttpCode(200)
  @Put('edit-password')
  public async editPassword(@Body() dto: InterfaceEmailAndPassword) {
    return this.userService.editPassword(dto);
  }

  @HttpCode(200)
  @Put('update')
  @Auth()
  updateUser(@Body() dto: UpdateUserDto, @User('_id') _id: string) {
    return this.userService.updateUser(dto, _id);
  }

  @HttpCode(200)
  @Get('my-products')
  @Auth()
  myProducts(@User('_id') _id: string) {
    return this.userService.myProducts(_id);
  }

  @HttpCode(200)
  @Get('transactions')
  @Auth()
  allTransactions(@User('customerId') customerId: string) {
    return this.userService.allTransactions(customerId);
  }
}
