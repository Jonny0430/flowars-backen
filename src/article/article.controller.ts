import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common'
import { ArticleService } from './article.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CreateArticleDto } from './dto/article.dto'
import { User } from 'src/user/decorators/user.decorator'

@Controller('article')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@HttpCode(200)
	@Post('create')
	@Auth('ADMIN')
	create(@Body() dto: CreateArticleDto, @User('_id') _id: string  ){
		return this.articleService.create(dto, _id)
	}

	@HttpCode(200)
	@Get('find-all')
	findAll() {
		return this.articleService.findAll()
	}

	@HttpCode(200)
	@Patch('update/:id')
	@Auth('ADMIN')
	update(@Param('id') id: string, @Body() updateArticle: CreateArticleDto) {
		return this.articleService.update(id, updateArticle)
	}

	@HttpCode(200)
	@Delete('delete/:id')
	@Auth('ADMIN')
	remove(@Param('id') id: string) {
		return this.articleService.remove(id)
	}

    @HttpCode(200)
	@Get('detailed-article/:slug')
	getDetailedProduct(@Param('slug') slug: string) {
		return this.articleService.getDetailedArticle(slug)
	}

    
}
