import {
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	MinLength,
} from 'class-validator';

export class CreateProductDto {
	@IsString()
	@MinLength(3, {
		message: 'Product name must be at least 3 characters long',
	})
	name!: string;

	@IsString()
	@MinLength(10, {
		message: 'Description must be at least 10 characters long',
	})
	description!: string;

	@IsNumber()
	@IsPositive()
	price!: number;

	@IsNumber()
	@IsPositive()
	stock!: number;

	@IsString()
	@IsOptional()
	imageUrl?: string;

	@IsString()
	@MinLength(3, { message: 'Category must be at least 3 characters long' })
	category!: string;

	@IsNumber()
	@IsPositive()
	tax!: number;
}
