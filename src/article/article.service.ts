import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Articles, ArticlesDocument } from './article.model'
import { Model } from 'mongoose'
import { CreateArticleDto } from './dto/article.dto'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class ArticleService {
	constructor(@InjectModel(Articles.name) private articleModel: Model<ArticlesDocument>) {}

	async create(dto: CreateArticleDto, _id: string) {
		const slugify = (str: string) =>
			str
				.trim()
				.toLowerCase()
				.replace(/\s+/g, '-') // Bo'sh joylarni "-" bilan almashtirish
				.replace(/[^\w-]+/g, '') // Maxsus belgilarni olib tashlash
				.substring(0, 50) // Maksimal uzunlikni belgilash (masalan, 50 ta belgi)

		const slug = slugify(dto?.description)
		const articles = await this.articleModel.create({ ...dto, slug: slug, author: _id })

		return articles
	}

	async findAll() {
		return this.articleModel.find().populate('author')
	}

	async update(id: string, updateArticle: CreateArticleDto) {
		return this.articleModel.findByIdAndUpdate(id, updateArticle, { new: true })
	}

	async remove(id: string) {
		return await this.articleModel.findByIdAndRemove(id)
	}

	async getDetailedArticle(slug: string) {
		const article = this.articleModel.findOne({ slug }).populate('author').exec()

		return article
	}
}
