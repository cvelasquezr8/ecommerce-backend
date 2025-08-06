import { Request, Response, NextFunction } from 'express';
import { CustomError, createLogger, admin } from '../config';
import { UserService } from '../services/user/user.service';
import { UserRepository } from '../repositories/user/user.repository';

const logger = createLogger('middlewares/auth');

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw CustomError.unauthorized(
			'Authorization header missing or invalid',
		);
	}

	const idToken = authHeader.split(' ')[1];

	try {
		const decodedToken = await admin.auth().verifyIdToken(idToken);
		if (!decodedToken || !decodedToken.user_id) {
			throw CustomError.unauthorized('Invalid token payload');
		}

		const userRepository = new UserRepository();
		const userService = new UserService(userRepository);
		const userData = await userService.getUserById(decodedToken.user_id);
		(req as any).user = {
			uid: decodedToken.user_id,
			name: decodedToken.name || userData?.name || 'Unknown',
			email: decodedToken.email,
			roles: userData?.roles || [],
			isAdmin: userData?.roles.includes('admin') || false,
		};

		next();
	} catch (error: unknown) {
		logger.error(
			`Error verifying Firebase ID token: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`,
		);
		return res.status(401).json({ message: 'Unauthorized: invalid token' });
	}
};
