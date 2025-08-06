import { Type } from 'class-transformer';
import {
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	MinLength,
} from 'class-validator';

export class UpdateProductDto {
	@IsOptional()
	@IsString()
	@MinLength(3, {
		message: 'Product name must be at least 3 characters long',
	})
	name?: string;

	@IsOptional()
	@IsString()
	@MinLength(10, {
		message: 'Description must be at least 10 characters long',
	})
	description?: string;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	price?: number;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	@Type(() => Number)
	stock?: number;

	@IsOptional()
	@IsString()
	@IsOptional()
	imageUrl?: string;

	@IsOptional()
	@IsString()
	@MinLength(3, { message: 'Category must be at least 3 characters long' })
	category?: string;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	@Type(() => Number)
	tax?: number;
}
