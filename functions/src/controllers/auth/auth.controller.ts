import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';


import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { createLogger } from '../../config/';
import { AuthService } from '../../services/auth/auth.service';
import { RegisterUserDto } from '../../dtos/auth/register-user.dto';

const logger = createLogger('controllers/auth');

export class AuthController {
	constructor(private readonly authService: AuthService) {}

	registerUser = async (req: Request, res: Response): Promise<Response> => {
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

		const [errorService] = await this.authService.registerUser(
			registerUserDto,
		);

		if (errorService) {
			logger.error(`Error registering user: ${errorService.message}`);
			return res
				.status(errorService.code)
				.json({ message: errorService.message });
		}

		return res
			.status(StatusCodes.CREATED)
			.json({ message: 'User registered successfully' });
	};
}
