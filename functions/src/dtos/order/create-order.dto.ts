import {
	IsNotEmpty,
	IsString,
	IsArray,
	ValidateNested,
	IsNumber,
	IsPositive,
	Length,
	IsMobilePhone,
	IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
	@IsString()
	@IsNotEmpty({ message: 'Product ID is required' })
	productID!: string;

	@IsNumber()
	@IsPositive({ message: 'Quantity must be a positive number' })
	quantity!: number;
}

class ShippingDetailsDto {
	@IsString()
	@IsNotEmpty({ message: 'First name is required' })
	firstName!: string;

	@IsString()
	@IsNotEmpty({ message: 'Last name is required' })
	lastName!: string;

	@IsEmail({}, { message: 'Invalid email address' })
	email!: string;

	@IsString()
	@IsNotEmpty({ message: 'Address is required' })
	address!: string;

	@IsString()
	@IsNotEmpty({ message: 'City is required' })
	city!: string;

	@IsString()
	@IsNotEmpty({ message: 'Country is required' })
	country!: string;

	@IsString()
	@IsNotEmpty({ message: 'State is required' })
	state!: string;

	@IsString()
	@IsNotEmpty({ message: 'Zip code is required' })
	@Length(3, 10)
	zipCode!: string;

	@IsString()
	@IsMobilePhone('es-EC', {}, { message: 'Invalid phone number' })
	phone!: string;
}

export class CreateOrderDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => OrderItemDto)
	items!: OrderItemDto[];

	@ValidateNested()
	@Type(() => ShippingDetailsDto)
	shippingDetails!: ShippingDetailsDto;
}
