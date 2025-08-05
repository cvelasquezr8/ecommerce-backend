import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../config';

export const authorizeRoles = (...allowedRoles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = (req as any).user;

		if (!user || !user.roles || !allowedRoles.some(role => user.roles.includes(role))) {
			throw CustomError.forbidden('Access denied: insufficient permissions');
		}

		next();
	};
};
``