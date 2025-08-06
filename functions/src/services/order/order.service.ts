import { Timestamp } from 'firebase-admin/firestore';

import { OrderModel } from '../../models/order.model';
import { createLogger, CustomError } from '../../config';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { CreateOrderDto, ResponseOrderDto } from '../../dtos/order';
import { OrderRepository } from '../../repositories/order/order.repository';

const logger = createLogger('services/order');

export class OrderService {
	constructor(private readonly orderRepository: OrderRepository) {}

	createOrder = async (
		createOrderDto: CreateOrderDto,
		userID: string,
	): Promise<ResponseOrderDto> => {
		const { items, shippingDetails } = createOrderDto;

		//* Check if items are provided
		const productIDs = items.map((item) => item.productID);
		const products = await this.orderRepository.findProductsByIDs(
			productIDs,
		);

		if (products.length !== productIDs.length) {
			throw CustomError.notFound('Some products not found');
		}

		//* Check stock availability and get subtotal, shipping, and total amounts
		const shippingFee = 5; // Flat shipping rate $5
		let subtotal = 0;
		let taxTotal = 0;
		for (const item of items) {
			const product = products.find((p) => p.id === item.productID);
			if (!product || product.stock < item.quantity) {
				throw CustomError.badRequest(
					`Insufficient stock for product ${
						product?.name || item.productID
					}`,
				);
			}

			const itemPrice = product.price * item.quantity;
			subtotal += itemPrice;

			const taxRate = product.tax / 100;
			taxTotal += itemPrice * taxRate;
		}

		const total = subtotal + taxTotal + shippingFee;
		const itemsData = items.map((item) => {
			const product = products.find((p) => p.id === item.productID);
			if (!product) {
				throw CustomError.notFound(
					`Product ${item.productID} not found`,
				);
			}
			return {
				productID: item.productID,
				name: product.name,
				description: product.description,
				imageUrl: product.imageUrl,
				quantity: item.quantity,
				price: product.price,
				tax: product.tax,
			};
		});

		const orderData: Omit<OrderModel, 'id'> = {
			items: itemsData,
			shippingDetails: {
				firstName: shippingDetails.firstName,
				lastName: shippingDetails.lastName,
				email: shippingDetails.email,
				address: shippingDetails.address,
				city: shippingDetails.city,
				state: shippingDetails.state,
				zipCode: shippingDetails.zipCode,
				country: shippingDetails.country,
			},
			status: OrderStatus.PENDING,
			subtotalAmount: subtotal,
			shippingAmount: shippingFee,
			totalAmount: total,
			createdAt: Timestamp.now(),
			updatedAt: null,
			deletedAt: null,
			createdBy: userID,
			updatedBy: null,
			deletedBy: null,
		};

		try {
			const newOrderID = await this.orderRepository.create(orderData);

			//* Update stock levels
			await this.orderRepository.updateStockAfterOrder(items);

			const order: OrderModel = {
				id: newOrderID,
				...orderData,
			};

			logger.info(`Order created with ID: ${newOrderID}`);
			return ResponseOrderDto.fromModel(order);
		} catch (error: any) {
			logger.error(`Error creating order: ${error.message}`);
			throw CustomError.internalServerError(
				'Server error, please try again later.',
			);
		}
	};

	async getAllOrders(): Promise<ResponseOrderDto[]> {
		const orders = await this.orderRepository.getAllOrders();
		return orders.map((order) => ResponseOrderDto.fromModel(order));
	}

	async getMyOrders(userID: string): Promise<ResponseOrderDto[]> {
		const userOrder = await this.orderRepository.getOrdersByUserID(userID);
		return userOrder.map((order) => ResponseOrderDto.fromModel(order));
	}

	async getOrderByID(
		orderID: string,
		userID: string,
		isAdmin: boolean = false,
	): Promise<ResponseOrderDto> {
		const order = await this.orderRepository.getOrderByID(
			orderID,
			userID,
			isAdmin,
		);

		if (!order) {
			logger.error(`Order with ID ${orderID} not found`);
			throw CustomError.notFound(`Order with ID ${orderID} not found`);
		}

		return ResponseOrderDto.fromModel(order);
	}

	async cancelOrder(
		orderID: string,
		userID: string,
		isAdmin: boolean = false,
	): Promise<void> {
		const order = await this.orderRepository.getOrderByID(
			orderID,
			userID,
			isAdmin,
		);

		if (!order) {
			logger.error(`Order with ID ${orderID} not found`);
			throw CustomError.notFound(`Order with ID ${orderID} not found`);
		}

		await this.orderRepository.updateOrderStatus(
			orderID,
			userID,
			OrderStatus.CANCELLED,
		);

		await this.orderRepository.restoreStockAfterOrderCancel(order.items);
		logger.info(`Order with ID ${orderID} canceled successfully`);
	}

	async updateOrder(
		orderID: string,
		userID: string,
		status: OrderStatus,
		isAdmin: boolean = false,
	): Promise<void> {
		const order = await this.orderRepository.getOrderByID(
			orderID,
			userID,
			isAdmin,
		);

		if (!order) {
			logger.error(`Order with ID ${orderID} not found`);
			throw CustomError.notFound(`Order with ID ${orderID} not found`);
		}

		if (order.status === OrderStatus.CANCELLED) {
			logger.error(
				`Cannot update order with status CANCELLED for ID ${orderID}`,
			);
			throw CustomError.badRequest(
				`Cannot update order with status CANCELLED`,
			);
		}

		await this.orderRepository.updateOrderStatus(orderID, userID, status);
		logger.info(`Order with ID ${orderID} updated to status ${status}`);
	}
}
