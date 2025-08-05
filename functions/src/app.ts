import express from 'express';
import cors from 'cors';
import { AuthRouter, ProductRouter } from './routes';
import { errorHandler } from './middlewares';
// import { setupSwagger } from './config/swagger';

const allowedOrigins = (process.env.CORS_URL || '')
	.split(',')
	.map((origin: String) => origin.trim());

const app = express();

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setupSwagger(app);
app.use('/auth', AuthRouter);
app.use('/product', ProductRouter);

app.use(errorHandler);
export default app;
