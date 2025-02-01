import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Books, BooksDocument } from './books.model'
import { Model } from 'mongoose'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'

@Injectable()
export class BooksService {
	constructor(@InjectModel(Books.name) private booksModel: Model<BooksDocument>) {}

	async create(createBookDto: CreateBookDto) {
		return await this.booksModel.create(createBookDto)
	}

	async findAll() {
		return await this.booksModel.find()
	}

	async update(id: string, updatedBookDto: UpdateBookDto) {
		return await this.booksModel.findByIdAndUpdate(id, updatedBookDto, { new: true })
	}

	async remove(id: string) {
		return await this.booksModel.findByIdAndRemove(id)
	}
}
