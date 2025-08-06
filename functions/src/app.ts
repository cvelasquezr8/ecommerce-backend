import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'reflect-metadata';

dotenv.config({ path: './src/.env' });

import { AuthRouter, ProductRouter, OrderRouter, UserRouter } from './routes';
import { errorHandler } from './middlewares';
import { onRequest } from 'firebase-functions/v2/https';
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
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', AuthRouter);
app.use('/product', ProductRouter);
app.use('/order', OrderRouter);
app.use('/user', UserRouter);

app.use(errorHandler);

export default app;

export const api = onRequest(
	{
		region: 'us-central1',
	},
	app,
);
