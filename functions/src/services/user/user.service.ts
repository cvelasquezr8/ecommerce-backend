import { CustomError, db } from "../../config";

export class UserService {
	private db = db;
	constructor() {
		// Initialize Firebase Admin SDK if not already initialized
		if (!this.db) {
			throw CustomError.internalServerError(
				'Firebase Admin SDK not initialized',
			);
		}
	}

  static async getUserById(uid: string) {
		const userDoc = await db.collection('users').doc(uid).get();
		if (!userDoc.exists) {
			throw CustomError.unauthorized('User not found in database');
		}

		return userDoc.data();
	}

}
