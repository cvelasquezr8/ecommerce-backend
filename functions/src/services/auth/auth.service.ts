import axios from 'axios';
import { Timestamp } from 'firebase-admin/firestore';

import { UserModel } from '../../models/user.model';
import { CustomError, createLogger, auth } from '../../config/';
import { LoginUserDto, RegisterUserDto } from '../../dtos/auth';
import { ResponseUserDto } from '../../dtos/user/response-user.dto';
import { UserRepository } from '../../repositories/user/user.repository';

const logger = createLogger('services/auth');

export class AuthService {
	private auth = auth;
	constructor(private readonly userRepository: UserRepository) {
		// Initialize Firebase Admin SDK if not already initialized
		if (!this.auth) {
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

	async registerUser(registerUserDto: RegisterUserDto): Promise<void> {
		const { email, password, firstName, lastName, roles } = registerUserDto;
		const userExists = await this.userExists(email);
		if (userExists) {
			throw CustomError.conflict(
				`User with email "${email}" already exists`,
			);
		}

		try {
			const userName = `${firstName} ${lastName}`;
			const userRecord = await this.auth.createUser({
				email,
				password,
				displayName: userName,
			});

			const data: Omit<UserModel, 'id'> = {
				email,
				firstName,
				lastName,
				roles,
				createdAt: Timestamp.now(),
			};

			await this.userRepository.createUser(userRecord.uid, data);

			logger.info(`User registered successfully: ${email}`);
		} catch (error: any) {
			logger.error(`Error registering user: ${error.message}`);
			throw CustomError.internalServerError(
				'Server error, please try again later.',
			);
		}
	}

	loginUser = async (
		loginUserDto: LoginUserDto,
	): Promise<ResponseUserDto> => {
		const { email, password } = loginUserDto;

		const userExists = await this.userExists(email);
		if (!userExists) {
			throw CustomError.unauthorized('Invalid email or password');
		}

		try {
			const response = await axios.post(
				`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
				{
					email,
					password,
					returnSecureToken: true,
				},
			);

			const { idToken, localId } = response.data;
			const user = await this.userRepository.findByID(localId);
			if (!user) {
				throw CustomError.unauthorized('Invalid email or password');
			}

			return ResponseUserDto.fromModel(
				{
					id: localId,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					roles: user.roles,
					createdAt: user.createdAt,
				},
				idToken,
			);
		} catch (error: any) {
			logger.error(`Error logging in user: ${error.message}`);
			throw CustomError.internalServerError(
				'Server error, please try again later.',
			);
		}
	};
}
