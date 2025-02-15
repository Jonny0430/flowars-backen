import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateReviewDto, EditReviewDto, GetByUserDto } from './dto/review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create')
  @HttpCode(201)
  @Auth()
  createReview(@Body() dto: CreateReviewDto, @Req() req) {
    const userId = req.user._id;
    return this.reviewService.createReview({ ...dto, author: userId });
  }

  @Delete('delete/:reviewId')
  @HttpCode(200)
  deleteReview(@Param('reviewId') reviewId: string) {
    return this.reviewService.deleteReview(reviewId);
  }

  @Put('edit/:reviewId')
  @HttpCode(200)
  editReview(@Param('reviewId') reviewId: string, @Body() dto: EditReviewDto) {
    return this.reviewService.editReview(reviewId, dto);
  }

  @Get('get/:productId')
  @HttpCode(200)
  getReview(@Param('productId') productId: string) {
    return this.reviewService.getReview(productId);
  }

  @Post('get-by-user')
  @HttpCode(200)
  getByUser(@Body() dto: GetByUserDto) {
    return this.reviewService.getByUser(dto);
  }
}
