export class CreateReviewDto {
	product: string
	author: string
	rating: number
	summary: string
}

export class EditReviewDto {
	summary: string
	rating: number
}

export class GetByUserDto {
    product: string
    user: string
}