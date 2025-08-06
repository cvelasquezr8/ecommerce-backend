import { Router } from 'express';

import { authMiddleware, authorizeRoles } from '../middlewares/';
import { OrderService } from '../services/order/order.service';
import { OrderController } from '../controllers/order/order.controller';
import { OrderRepository } from '../repositories/order/order.repository';

const OrderRouter = Router();
const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

const rolesAllowed = ['admin'];

OrderRouter.get('/me', authMiddleware, orderController.getMyOrders);
OrderRouter.get(
	'/',
	authMiddleware,
	authorizeRoles(...rolesAllowed),
	orderController.getAllOrders,
);
OrderRouter.post('/', authMiddleware, orderController.createOrder);
OrderRouter.put(
	'/:id',
	authMiddleware,
	authorizeRoles(...rolesAllowed),
	orderController.updateOrder,
);
OrderRouter.get('/:id', authMiddleware, orderController.getOrderByID);
OrderRouter.delete('/:id', authMiddleware, orderController.deleteOrder);

export default OrderRouter;
