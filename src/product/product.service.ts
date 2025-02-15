import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PetProduct, ProductDocument } from './product.model';
import { Model } from 'mongoose';
import { PetProductDto } from './product.dto';
import { Agent, AgentDocument } from 'src/agent/agent.model';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from 'src/user/user.model';
import { Review, ReviewDocument } from 'src/review/review.model';
import { reduce } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(PetProduct.name) private productModel: Model<ProductDocument>,
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  public async createProduct(dto: PetProductDto, _id: string) {
    const slugify = (str: string) =>
      str
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-') // Bo'sh joylarni "-" bilan almashtirish
        .replace(/[^\w-]+/g, '') // Maxsus belgilarni olib tashlash
        .substring(0, 50); // Maksimal uzunlikni belgilash (masalan, 50 ta belgi)
    const slug = slugify(dto.productName);
    const product = await this.productModel.create({ ...dto, slug: slug, author: _id });
    await this.agentModel.findOneAndUpdate(
      { author: _id },
      { $push: { products: product._id } },
      { new: true },
    );
    return 'Success';
  }

  public async editProduct(dto: PetProductDto, productId: string) {
    return await this.productModel.findByIdAndUpdate(productId, dto, { new: true });
  }

  public async deleteProduct(productId: string, userId: string) {
    await this.productModel.findByIdAndRemove(productId);
    await this.agentModel.findOneAndUpdate(
      { author: userId },
      { $pull: { products: productId } },
      { new: true },
    );

    return 'Success';
  }

  public async activateProduct(productId: string) {
    const product = await this.productModel.findByIdAndUpdate(
      productId,
      { $set: { isActive: true } },
      { new: true },
    );

    return product;
  }

  public async draftProduct(productId: string) {
    const product = await this.productModel.findByIdAndUpdate(
      productId,
      { $set: { isActive: false } },
      { new: true },
    );

    return product;
  }

  public async getProducts() {
    // const products = await this.productModel.find().sort({ createdAt: -1 }).populate('author').exec()
    const products = await this.productModel
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'product',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewCount: { $size: '$reviews' },
            reviewAvg: { $avg: '$reviews.rating' },
          },
        },
        {
          $unwind: `$author`,
        },
        {
          $project: {
            _id: 1,
            author: 1,
            slug: 1,
            isActive: 1,
            image: 1,
            price: 1,
            color: 1,
            location: 1,
            category: 1,
            availability: 1,
            gender: 1,
            age: 1,
            description: 1,
            productName: 1,
            species: 1,
            requirements: 1,
            updatedAt: 1,
            reviewCount: 1,
            reviewAvg: 1,
          },
        },
      ])
      .sort({ createdAt: -1 })
      .exec();

    return await products.map(product => this.getSpecificFieldProduct(product));
  }

  getSpecificProduct(product: ProductDocument & { reviewCount: number; reviewAvg: number }) {
    return {
      productName: product.productName,
      image: product.image,
      price: product.price,
      availability: product.availability,
      location: product.location,
      age: product.age,
      species: product.species,
      gender: product.gender,
      category: product.category,
      description: product.description,
      _id: product._id,
      reviewCount: product.reviewCount,
      reviewAvg: product.reviewAvg,
      author: {
        fullName: product.author.fullName,
        avatar: product.author.avatar,
      },
    };
  }

  public async getAllByAdminProducts() {
    return await this.productModel.find().exec();
  }

  public async getUserAllProducts(userId: string) {
    const user = await await this.userModel.findById(userId).populate('products').exec();
    return user.products;
  }

  async getDetailedProduct(slug: string) {
    const product = (await this.productModel
      .findOne({ slug })
      .populate('author')
      .exec()) as ProductDocument & {
      reviewCount: number;
      reviewAvg: number;
    };

    const reviews = await this.reviewModel.find({ product: product._id });
    const avarage = this.getReviewAverage(reviews.map(c => c.rating));
    const allClients = await this.userModel.find({ products: product._id });

    return {
      ...this.getSpecificFieldProduct(product),
      reviewCount: reviews.length,
      reviewAvg: avarage,
      allClients: allClients.length,
    };
  }

  getReviewAverage(ratingArr: number[]): number {
    if (ratingArr.length === 0) {
      return 5; // Reyting yo'q bo'lsa, 5 qaytaradi
    }

    if (ratingArr.length === 1) {
      return ratingArr[0]; // Faqat bitta reyting bo'lsa, o'shani qaytaradi
    }

    // Bir nechta reytinglar bo'lsa, o'rtacha hisoblaydi
    const total = ratingArr.reduce((prev, next) => prev + next, 0);
    return total / ratingArr.length;
  }

  getSpecificFieldProduct(product: ProductDocument & { reviewCount: number; reviewAvg: number }) {
    return {
      productName: product?.productName,
      image: product?.image,
      _id: product?._id,
      author: {
        fullName: product?.author.fullName,
        avatar: product?.author.avatar,
        email: product?.author.email,
        role: product?.author.role,
        bio: product?.author?.bio,
      },
      updatedAt: product?.updatedAt,
      location: product?.location,
      requirements: product?.requirements,
      description: product?.description,
      slug: product?.slug,
      age: product?.age,
      species: product?.species,
      gender: product?.gender,
      availability: product?.availability,
      category: product?.category,
      price: product?.price,
      reviewCount: product.reviewCount,
      reviewAvg: product.reviewAvg,
    };
  }

  async enrollUser(userId: string, productId: string) {
    await await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: { products: productId },
      },

      { new: true },
    );

    return 'Success';
  }
}
