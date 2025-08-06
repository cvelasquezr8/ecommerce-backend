import { Timestamp } from 'firebase-admin/firestore';

export class UserModel {
	constructor(
		public id: string,
		public email: string,
		public firstName: string,
		public lastName: string,
		public roles: string[],
		public createdAt: Timestamp,
	) {}
}
