import { CustomError, db } from '../../config';
import { UserModel } from '../../models/user.model';

export class UserRepository {
	private collection = db.collection('users');

	findByID(
		uid: string,
	): Promise<FirebaseFirestore.DocumentData | null | undefined> {
		return this.collection
			.doc(uid)
			.get()
			.then((doc) => {
				if (!doc.exists) return null;
				return doc.data();
			});
	}

	findAll(): Promise<UserModel[]> {
		return this.collection
			.get()
			.then((snapshot) => {
				const users: UserModel[] = [];
				snapshot.forEach((doc) => {
					const data = doc.data();
					users.push(
						new UserModel(
							doc.id,
							data.email,
							data.firstName,
							data.lastName,
							data.roles,
							data.createdAt,
						),
					);
				});
				return users;
			})
			.catch((error) => {
				throw CustomError.internalServerError(
					`Error fetching users: ${error.message}`,
				);
			});
	}

	async createUser(uid: string, data: Omit<UserModel, 'id'>): Promise<void> {
		await this.collection.doc(uid).set(data);
	}
}
