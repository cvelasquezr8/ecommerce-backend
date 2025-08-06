import { createLogger, CustomError } from '../../config';
import { ResponseUserDto } from '../../dtos/user/response-user.dto';
import { UserRepository } from '../../repositories/user/user.repository';

const logger = createLogger('services/user');

export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async getUserById(uid: string) {
		const userDoc = await this.userRepository.findByID(uid);
		if (!userDoc) {
			logger.error(`User with ID ${uid} not found`);
			throw CustomError.notFound('User not found');
		}
		return userDoc;
	}

	async getAllUsers() {
		const users = await this.userRepository.findAll();
		return users.map((user) => ResponseUserDto.fromModel(user));
	}
}
