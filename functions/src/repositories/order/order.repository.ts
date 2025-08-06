import { Timestamp } from 'firebase-admin/firestore';

import { CustomError, db } from '../../config';
import { OrderModel } from '../../models/order.model';
import { ProductModel } from '../../models/product.model';
import { OrderStatus } from '../../common/enums/order-status.enum';

export class OrderRepository {
	private collection = db.collection('orders');

	async create(data: Omit<OrderModel, 'id'>): Promise<string> {
		const ref = await this.collection.add(data);
		return ref.id;
	}

	async findProductsByIDs(productIDs: string[]): Promise<ProductModel[]> {
		const products: ProductModel[] = [];
		const snapshot = await db
			.collection('products')
			.where('id', 'in', productIDs)
			.where('deletedAt', '==', null)
			.get();

		snapshot.forEach((doc) => {
			products.push({ id: doc.id, ...doc.data() } as ProductModel);
		});

		return products;
	}

	async updateStockAfterOrder(
		items: { productID: string; quantity: number }[],
	): Promise<void> {
		const batch = db.batch();

		for (const item of items) {
			const productRef = db.collection('products').doc(item.productID);
			const productSnap = await productRef.get();

			if (!productSnap.exists) {
				continue;
			}

			const productData = productSnap.data();
			const newStock = (productData?.stock ?? 0) - item.quantity;

			if (newStock < 0) {
				throw CustomError.internalServerError(
					`Negative stock for product ${item.productID}`,
				);
			}

			batch.update(productRef, {
				stock: newStock,
				updatedAt: Timestamp.now(),
			});
		}

		await batch.commit();
	}

	getAllOrders = async (): Promise<OrderModel[]> => {
		const snapshot = await this.collection
			.where('deletedAt', '==', null)
			.get();
		return snapshot.docs.map(
			(doc) => ({ id: doc.id, ...doc.data() } as OrderModel),
		);
	};

	getOrdersByUserID = async (userID: string): Promise<OrderModel[]> => {
		const snapshot = await this.collection
			.where('createdBy', '==', userID)
			.where('deletedAt', '==', null)
			.get();

		return snapshot.docs.map(
			(doc) => ({ id: doc.id, ...doc.data() } as OrderModel),
		);
	};

	getOrderByID = async (
		orderID: string,
		userID: string,
		isAdmin: boolean = false,
	): Promise<OrderModel | null> => {
		const orderRef = this.collection.doc(orderID);
		const orderSnap = await orderRef.get();
		if (!orderSnap.exists) {
			return null;
		}

		const orderData = orderSnap.data() as OrderModel;
		if (!isAdmin) {
			if (userID && orderData.createdBy !== userID) {
				throw CustomError.forbidden(
					'You do not have permission to access this order',
				);
			}
		}

		return orderData;
	};

	async restoreStockAfterOrderCancel(
		items: { productID: string; quantity: number }[],
	): Promise<void> {
		const batch = db.batch();

		for (const item of items) {
			const productRef = db.collection('products').doc(item.productID);
			const productSnap = await productRef.get();

			if (!productSnap.exists) {
				continue;
			}

			const productData = productSnap.data();
			const currentStock = productData?.stock ?? 0;

			const newStock = currentStock + item.quantity;

			batch.update(productRef, {
				stock: newStock,
				updatedAt: Timestamp.now(),
			});
		}

		await batch.commit();
	}

	async updateOrderStatus(
		orderID: string,
		userID: string,
		status: OrderStatus,
	): Promise<void> {
		const orderRef = this.collection.doc(orderID);
		await orderRef.update({
			status,
			updatedAt: Timestamp.now(),
			updatedBy: userID,
		});
	}
}
