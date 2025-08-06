import { Timestamp } from 'firebase-admin/firestore';
import { OrderStatus } from '../common/enums/order-status.enum';

export interface OrderItem {
	productID: string;
	name: string;
	description: string;
	imageUrl: string;
	quantity: number;
	price: number;
	tax: number;
}

export interface ShippingDetails {
	firstName: string;
	lastName: string;
	email: string;
	address: string;
	city: string;
	state: string;
	country: string;
	zipCode: string;
	phone: string;
}

export interface OrderModel {
	id: string;
	shippingDetails: ShippingDetails;
	items: OrderItem[];
	subtotalAmount: number;
	shippingAmount: number;
	totalAmount: number;
	status: OrderStatus;

	createdAt: Timestamp;
	updatedAt: Timestamp | null;
	deletedAt: Timestamp | null;

	createdBy: string;
	updatedBy: string | null;
	deletedBy: string | null;
}
