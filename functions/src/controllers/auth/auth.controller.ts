import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { createLogger } from '../../config/';
import { AuthService } from '../../services/auth/auth.service';
import { RegisterUserDto } from '../../dtos/auth/register-user.dto';
import { LoginUserDto } from '../../dtos/auth/login-user.dto';

const logger = createLogger('controllers/auth');

export class AuthController {
	constructor(private readonly authService: AuthService) {}

	registerUser = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		const registerUserDto = plainToInstance(RegisterUserDto, req.body);
		const errors = await validate(registerUserDto);

		if (errors.length > 0) {
			logger.error(`Validation failed: ${JSON.stringify(errors)}`);
			const errorMessages = errors.map((e) =>
				Object.values(e.constraints || {}).join(', '),
			);

			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Validation failed', errors: errorMessages });
		}

		try {
			await this.authService.registerUser(registerUserDto);
			return res
				.status(StatusCodes.CREATED)
				.json({ message: 'User registered successfully' });
		} catch (error) {
			return next(error);
		}
	};

	loginUser = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		const loginUserDto = plainToInstance(LoginUserDto, req.body);
		const errors = await validate(loginUserDto);

		if (errors.length > 0) {
			logger.error(`Validation failed: ${JSON.stringify(errors)}`);
			const errorMessages = errors.map((e) =>
				Object.values(e.constraints || {}).join(', '),
			);

			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Validation failed', errors: errorMessages });
		}

		try {
			const user = await this.authService.loginUser(loginUserDto);
			return res
				.status(StatusCodes.OK)
				.json({ message: 'Login successful', user });
		} catch (error) {
			return next(error);
		}
	};
}
