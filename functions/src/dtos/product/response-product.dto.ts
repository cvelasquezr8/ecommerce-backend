import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
} from 'class-validator';
import { ProductModel } from '../../models/product.model';

export class ResponseProductDto {
	@IsString()
	@IsNotEmpty({ message: 'Product ID is required' })
	id!: string;

	@IsString()
	@IsNotEmpty({ message: 'Product name is required' })
	name!: string;

	@IsString()
	@IsNotEmpty({ message: 'Description is required' })
	description!: string;

	@IsString()
	@IsNotEmpty({ message: 'Category is required' })
	category!: string;

	@IsNumber()
	@IsPositive({ message: 'Price must be a positive number' })
	price!: number;

	@IsNumber()
	@IsPositive({ message: 'Stock must be a positive number' })
	stock!: number;

	@IsNumber()
	@IsPositive({ message: 'Tax must be a positive number' })
	tax!: number;

	@IsString()
	@IsOptional()
	imageUrl?: string;

	static fromModel(model: ProductModel): ResponseProductDto {
		const dto = new ResponseProductDto();
		dto.id = model.id;
		dto.name = model.name;
		dto.description = model.description;
		dto.category = model.category;
		dto.price = model.price;
		dto.stock = model.stock;
		dto.tax = model.tax;
		dto.imageUrl = model.imageUrl;
		return dto;
	}
}
