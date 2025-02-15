import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './review.model';
import { CreateReviewDto, EditReviewDto, GetByUserDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) {}

  async createReview(dto: CreateReviewDto) {
    const review = await this.reviewModel.create(dto);

    return review;
  }

  async deleteReview(reviewId: string) {
    const isReview = await this.reviewModel.findById(reviewId);
    if (!isReview) throw new NotFoundException('Review with id not found');

    const review = await this.reviewModel.findByIdAndRemove(reviewId);

    return review._id;
  }

  async editReview(reviewId: string, dto: EditReviewDto) {
    const { rating, summary } = dto;
    const review = await this.reviewModel.findByIdAndUpdate(
      reviewId,
      { $set: { rating, summary } },
      { new: true },
    );

    return review._id;
  }

  async getReview(productId: string) {
    const reviews = await this.reviewModel.find({ product: productId }).populate('author').exec();

    return reviews;
  }

  async getByUser({ product, user }: GetByUserDto) {
    const reviews = await this.reviewModel.find({ product }).exec();
    const isExist = reviews.find(c => String(c.author) === user);

    return isExist;
  }
}
