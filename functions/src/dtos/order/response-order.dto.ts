import {
	IsNotEmpty,
	IsOptional,
	IsString,
	IsArray,
	IsNumber,
	IsPositive,
	ValidateNested,
	IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
	OrderModel,
	OrderItem,
	ShippingDetails,
} from '../../models/order.model';
import { OrderStatus } from '../../common/enums/order-status.enum';

class ResponseOrderItemDto {
	@IsString()
	productID!: string;

	@IsString()
	name!: string;

	@IsString()
	description!: string;

	@IsString()
	imageUrl!: string;

	@IsNumber()
	@IsPositive()
	quantity!: number;

	@IsNumber()
	@IsPositive()
	priceAtPurchase!: number;

	@IsNumber()
	@IsPositive()
	taxAtPurchase!: number;

	static fromModel(item: OrderItem): ResponseOrderItemDto {
		const dto = new ResponseOrderItemDto();
		dto.productID = item.productID;
		dto.name = item.name;
		dto.description = item.description;
		dto.imageUrl = item.imageUrl;
		dto.quantity = item.quantity;
		dto.priceAtPurchase = item.price;
		dto.taxAtPurchase = item.tax;
		return dto;
	}
}

class ResponseShippingDetailsDto {
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
	city!: string;

	@IsString()
	@IsOptional()
	state?: string;

	@IsString()
	@IsOptional()
	country?: string;

	@IsString()
	zipCode!: string;

	@IsString()
	phone!: string;

	static fromModel(details: ShippingDetails): ResponseShippingDetailsDto {
		const dto = new ResponseShippingDetailsDto();
		dto.firstName = details.firstName;
		dto.lastName = details.lastName;
		dto.email = details.email;
		dto.address = details.address;
		dto.city = details.city;
		dto.state = details.state;
		dto.country = details.country;
		dto.zipCode = details.zipCode;
		dto.phone = details.phone;
		return dto;
	}
}

export class ResponseOrderDto {
	@IsString()
	id!: string;

	@ValidateNested()
	@Type(() => ResponseShippingDetailsDto)
	shippingDetails!: ResponseShippingDetailsDto;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ResponseOrderItemDto)
	items!: ResponseOrderItemDto[];

	@IsNumber()
	@IsPositive()
	subtotal!: number;

	@IsNumber()
	@IsPositive()
	taxTotal!: number;

	@IsNumber()
	@IsPositive()
	shippingFee!: number;

	@IsNumber()
	@IsPositive()
	total!: number;

	@IsString()
	status!: OrderStatus;

	@IsString()
	createdBy!: string;

	@IsOptional()
	updatedBy?: string | null;

	@IsOptional()
	deletedBy?: string | null;

	@IsNotEmpty()
	createdAt!: string;

	@IsOptional()
	updatedAt?: string | null;

	static fromModel(model: OrderModel): ResponseOrderDto {
		const dto = new ResponseOrderDto();

		dto.id = model.id;
		dto.shippingDetails = ResponseShippingDetailsDto.fromModel(
			model.shippingDetails,
		);
		dto.items = model.items.map((item) =>
			ResponseOrderItemDto.fromModel(item),
		);

		dto.subtotal = model.subtotalAmount;
		dto.taxTotal = model.items.reduce((acc, item) => {
			const taxRate = item.tax / 100;
			return acc + item.price * item.quantity * taxRate;
		}, 0);

		dto.shippingFee = model.shippingAmount;
		dto.total = model.totalAmount;

		dto.status = model.status;
		dto.createdBy = model.createdBy;
		dto.updatedBy = model.updatedBy;
		dto.deletedBy = model.deletedBy;
		dto.createdAt = model.createdAt.toDate().toISOString();
		dto.updatedAt = model.updatedAt?.toDate().toISOString() ?? null;

		return dto;
	}
}
