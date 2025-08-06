import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import 'reflect-metadata';

dotenv.config();

import { AuthRouter, ProductRouter, OrderRouter, UserRouter } from './routes';
import { errorHandler } from './middlewares';

const allowedOrigins = (process.env.CORS_URL || '')
	.split(',')
	.map((origin: string) => origin.trim());

const app = express();

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', AuthRouter);
app.use('/product', ProductRouter);
app.use('/order', OrderRouter);
app.use('/user', UserRouter);

app.use(errorHandler);

export default app;
