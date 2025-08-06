import { NextFunction, Request, Response } from 'express';

import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';

import { OrderService } from '../../services/order/order.service';
import { CreateOrderDto } from '../../dtos/order/create-order.dto';
import { OrderStatus } from '../../common/enums/order-status.enum';

export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	createOrder = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		const { user } = req as any;
		const createOrderDto = plainToInstance(CreateOrderDto, req.body);
		const errors = await validate(createOrderDto);
		if (errors.length > 0) {
			const errorMessages = errors.map((e) =>
				Object.values(e.constraints || {}).join(', '),
			);

			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Validation failed',
				errors: errorMessages,
			});
		}

		try {
			const order = await this.orderService.createOrder(
				createOrderDto,
				user.uid,
			);

			return res.status(StatusCodes.CREATED).json({
				message: 'Order created successfully',
				order,
			});
		} catch (error) {
			return next(error);
		}
	};

	getAllOrders = async (req: Request, res: Response): Promise<Response> => {
		const orders = await this.orderService.getAllOrders();
		return res.status(StatusCodes.OK).json({
			message: 'Orders fetched successfully',
			orders,
		});
	};

	getMyOrders = async (req: Request, res: Response): Promise<Response> => {
		const { user } = req as any;
		const orders = await this.orderService.getMyOrders(user.uid);
		return res.status(StatusCodes.OK).json({
			message: 'Orders fetched successfully',
			orders,
		});
	};

	getOrderByID = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		const orderID = req.params.id;
		if (!orderID) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Order ID is required',
			});
		}

		try {
			const { user } = req as any;
			const order = await this.orderService.getOrderByID(
				orderID,
				user.uid,
				user.isAdmin,
			);

			return res.status(StatusCodes.OK).json({
				message: 'Order fetched successfully',
				order,
			});
		} catch (error) {
			return next(error);
		}
	};

	deleteOrder = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		const orderID = req.params.id;
		if (!orderID) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Order ID is required',
			});
		}

		try {
			const { user } = req as any;
			await this.orderService.cancelOrder(
				orderID,
				user.uid,
				user.isAdmin,
			);

			return res.status(StatusCodes.NO_CONTENT).send();
		} catch (error) {
			return next(error);
		}
	};

	async updateOrder(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> {
		const orderID = req.params.id;
		if (!orderID) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Order ID is required',
			});
		}

		try {
			const { user } = req as any;
			const orderStatus = req.body.status;
			if (!orderStatus) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message: 'Order status is required',
				});
			}

			if (!Object.values(OrderStatus).includes(orderStatus)) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message: 'Invalid order status',
				});
			}

			const updatedOrder = await this.orderService.updateOrder(
				orderID,
				user.uid,
				orderStatus,
				user.isAdmin,
			);

			return res.status(StatusCodes.OK).json({
				message: 'Order updated successfully',
				order: updatedOrder,
			});
		} catch (error) {
			return next(error);
		}
	}
}
