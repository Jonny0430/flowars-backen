// import { Species, Gender, Location, Availability, Category } from './product.enum';

export class PetProductDto {
	productName: string // Mahsulot nomi
	species: string // Hayvon turi (masalan, it, mushuk)
	age: string // Hayvonning yoshi
	gender: string // Hayvonning jinsi
	description: string // Mahsulotning batafsil tavsifi
	price: number // Mahsulotning narxi
	image?: string // Mahsulot rasmlari URL'lari
	availability: string // Mahsulot mavjudligi
	color: string[] // Mahsulotning rangi
	requirements: string[]
	location: string // Mahsulot joylashuvi
	category: string // Mahsulotning kategoriyasi
	slug?: string
}
