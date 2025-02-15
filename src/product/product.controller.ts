import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PetProductDto } from './product.dto';
import { User } from 'src/user/decorators/user.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @HttpCode(200)
  @Post('create')
  @Auth('AGENT')
  public async createProduct(@Body() dto: PetProductDto, @User('_id') _id: string) {
    return this.productService.createProduct(dto, _id);
  }

  @HttpCode(200)
  @Patch('edit/:productId')
  @Auth('AGENT')
  public async editProduct(@Body() dto: PetProductDto, @Param('productId') productId: string) {
    return this.productService.editProduct(dto, productId);
  }

  @HttpCode(200)
  @Delete('delete/:productId')
  @Auth('AGENT')
  public async deleteProduct(@Param('productId') productId: string, @User('_id') _id: string) {
    return this.productService.deleteProduct(productId, _id);
  }

  @HttpCode(200)
  @Put('activate/:productId')
  @Auth('AGENT')
  public async activateProduct(@Param('productId') productId: string) {
    return this.productService.activateProduct(productId);
  }

  @HttpCode(200)
  @Put('draft/:productId')
  @Auth('AGENT')
  public async draftProduct(@Param('productId') productId: string) {
    return this.productService.draftProduct(productId);
  }

  @HttpCode(200)
  @Get('all')
  public async getProducts() {
    return this.productService.getProducts();
  }

  @HttpCode(200)
  @Get('admin-all-products')
  public async getAllByAdminProducts() {
    return this.productService.getAllByAdminProducts();
  }

  @HttpCode(200)
  @Get('user-all-products')
  @Auth()
  public async getUserAllProducts(@User('_id') _id: string) {
    return this.productService.getUserAllProducts(_id);
  }

  @HttpCode(200)
  @Get('detailed-product/:slug')
  getDetailedProduct(@Param('slug') slug: string) {
    return this.productService.getDetailedProduct(slug);
  }

  @HttpCode(200)
  @Put('enroll-user/:productId')
  @Auth()
  enrollUser(@User('_id') _id: string, @Param('productId') productId: string) {
    return this.productService.enrollUser(_id, productId);
  }
}
