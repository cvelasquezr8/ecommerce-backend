import { Timestamp } from 'firebase-admin/firestore';

export class ProductModel {
	constructor(
		public id: string,
		public name: string,
		public description: string,
		public price: number,
		public category: string,
		public stock: number,
		public tax: number,
		public imageUrl: string,
		public createdAt: Timestamp,
		public updatedAt: Timestamp | null,
		public deletedAt: Timestamp | null,
		public createdBy: string,
		public updatedBy: string | null,
		public deletedBy: string | null,
	) {}
}
