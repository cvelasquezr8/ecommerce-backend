import winston from 'winston';
const chalk = require('chalk');

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
	info: (msg: string) => baseLogger.info(chalk.cyan(`[${context}] ${msg}`)),
	warn: (msg: string) => baseLogger.warn(chalk.yellow(`[${context}] ${msg}`)),
	error: (msg: string) => baseLogger.error(chalk.red(`[${context}] ${msg}`)),
	debug: (msg: string) =>
		baseLogger.debug(chalk.green(`[${context}] ${msg}`)),
});
