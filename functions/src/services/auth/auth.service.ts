import { IGenericResponse } from '../../common/interfaces/generic-response.interface';
import { CustomError, createLogger, auth, db } from '../../config/';
import { RegisterUserDto } from '../../dtos/auth/register-user.dto';

const logger = createLogger('services/auth');

export class AuthService {
	private auth = auth;
	private db = db;
	constructor() {
		// Initialize Firebase Admin SDK if not already initialized
		if (!this.auth || !this.db) {
			throw CustomError.internalServerError(
				'Firebase Admin SDK not initialized',
			);
		}
	}

	private async userExists(email: string): Promise<boolean> {
		try {
			await this.auth.getUserByEmail(email);
			return true;
		} catch (error: any) {
			if (error.code === 'auth/user-not-found') {
				return false;
			}
			throw error;
		}
	}

	async registerUser(
		registerUserDto: RegisterUserDto,
	): Promise<[IGenericResponse | undefined]> {
		const { email, password, userName, roles } = registerUserDto;
		const userExists = await this.userExists(email);
		if (userExists) {
			return [{ code: 400, message: 'Email already in use' }];
		}

		try {
			const userRecord = await this.auth.createUser({
				email,
				password,
				displayName: userName,
			});

			await this.db.collection('users').doc(userRecord.uid).set({
				userName,
				email,
				roles,
				createdAt: new Date().toISOString(),
			});

			logger.info(`User registered successfully: ${email}`);
			return [undefined];
		} catch (error: any) {
			logger.error(`[registerUser] ${error.code}: ${error.message}`);
			return [
				{ code: 500, message: 'Server error, please try again later.' },
			];
		}
	}
}
