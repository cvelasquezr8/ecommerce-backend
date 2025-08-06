import { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { UserService } from '../../services/user/user.service';

export class UserController {
	constructor(private readonly userService: UserService) {}

	getAllUsers = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		try {
			const users = await this.userService.getAllUsers();
			return res.status(StatusCodes.OK).json({
				message: 'Users fetched successfully',
				users,
			});
		} catch (error) {
			return next(error);
		}
	};
}
