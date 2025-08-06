import { Timestamp } from 'firebase-admin/firestore';

import { db } from '../../config';
import { ProductModel } from '../../models/product.model';

export class ProductRepository {
	private collection = db.collection('products');

	async findByName(name: string): Promise<ProductModel | null> {
		const snapshot = await this.collection
			.where('name', '==', name)
			.limit(1)
			.get();
		if (snapshot.empty) return null;

		const doc = snapshot.docs[0];
		return this.toModel(doc.id, doc.data());
	}

	async findByID(id: string): Promise<ProductModel | null> {
		const doc = await this.collection.doc(id).get();

		if (!doc.exists) return null;

		const data = doc.data();
		if (!data) return null;

		return this.toModel(doc.id, data);
	}

	async create(data: Omit<ProductModel, 'id'>): Promise<string> {
		const ref = await this.collection.add(data);
		return ref.id;
	}

	async softDelete(id: string, userID: string): Promise<void> {
		await this.collection.doc(id).update({
			deletedAt: Timestamp.now(),
			deletedBy: userID,
		});
	}

	async update(
		id: string,
		data: Partial<Omit<ProductModel, 'id'>>,
	): Promise<void> {
		await this.collection.doc(id).update({
			...data,
			updatedAt: Timestamp.now(),
			updatedBy: data.updatedBy || null,
		});
	}

	async findAll(): Promise<ProductModel[]> {
		const snapshot = await this.collection.get();
		return snapshot.docs.map((doc) => this.toModel(doc.id, doc.data()));
	}

	private toModel(
		id: string,
		data: FirebaseFirestore.DocumentData,
	): ProductModel {
		return new ProductModel(
			id,
			data.name,
			data.description,
			data.price,
			data.category,
			data.stock,
			data.tax,
			data.imageUrl || '',
			data.createdAt?.toDate(),
			data.updatedAt?.toDate() || null,
			data.deletedAt?.toDate() || null,
			data.createdBy,
			data.updatedBy || null,
			data.deletedBy || null,
		);
	}
}
