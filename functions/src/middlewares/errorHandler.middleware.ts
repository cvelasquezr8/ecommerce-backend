import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const errorHandler = (
	err: any,
	_: Request,
	res: Response,
	__: NextFunction,
) => {
	const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
	const message = err.message || 'Internal Server Error';

	res.status(statusCode).json({ message });
};