import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Articles, ArticlesSchema } from './article.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Articles.name, schema: ArticlesSchema }])],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
