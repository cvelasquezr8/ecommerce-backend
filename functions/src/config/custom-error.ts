import { StatusCodes } from 'http-status-codes';

export class CustomError extends Error {
	constructor(
		public readonly statusCode: number,
		public readonly message: string,
	) {
		super(message);
	}

	static badRequest(message: string): CustomError {
		return new CustomError(StatusCodes.BAD_REQUEST, message);
	}

	static unauthorized(message: string): CustomError {
		return new CustomError(StatusCodes.UNAUTHORIZED, message);
	}

	static forbidden(message: string): CustomError {
		return new CustomError(StatusCodes.FORBIDDEN, message);
	}

	static notFound(message: string): CustomError {
		return new CustomError(StatusCodes.NOT_FOUND, message);
	}

	static conflict(message: string): CustomError {
		return new CustomError(StatusCodes.CONFLICT, message);
	}

	static internalServerError(message: string): CustomError {
		return new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, message);
	}
}
