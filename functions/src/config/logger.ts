import winston from 'winston';

const baseLogger = winston.createLogger({
	level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({ timestamp, level, message }) => {
			return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
		}),
	),
	transports: [new winston.transports.Console()],
});

export const createLogger = (context: string) => ({
	info: (msg: string) => baseLogger.info(`[${context}] ${msg}`),
	warn: (msg: string) => baseLogger.warn(`[${context}] ${msg}`),
	error: (msg: string) => baseLogger.error(`[${context}] ${msg}`),
	debug: (msg: string) => baseLogger.debug(`[${context}] ${msg}`),
});
