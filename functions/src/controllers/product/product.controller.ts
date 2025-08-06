import { NextFunction, Request, Response } from 'express';

import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';

import { CreateProductDto, UpdateProductDto } from '../../dtos/product';
import { ProductService } from '../../services/product/product.service';

export class ProductController {
	constructor(private readonly productService: ProductService) {}

	createProduct = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		const { user } = req as any;
		const createProductDto = plainToInstance(CreateProductDto, req.body);
		const errors = await validate(createProductDto);
		if (errors.length > 0) {
			const errorMessages = errors.map((e) =>
				Object.values(e.constraints || {}).join(', '),
			);
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Validation failed', errors: errorMessages });
		}

		try {
			const product = await this.productService.createProduct(
				createProductDto,
				user.uid,
			);

			return res.status(StatusCodes.CREATED).json({
				message: 'Product created successfully',
				product,
			});
		} catch (error) {
			return next(error);
		}
	};

	getAllProducts = async (req: Request, res: Response): Promise<Response> => {
		const products = await this.productService.getAllProducts();
		return res.status(StatusCodes.OK).json({
			message: 'Products fetched successfully',
			products,
		});
	};

	getProductByID = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		const productID = req.params.id;
		if (!productID) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Product ID is required' });
		}

		try {
			const product = await this.productService.findOne(productID);
			return res.status(StatusCodes.OK).json({
				message: 'Product fetched successfully',
				product,
			});
		} catch (error) {
			return next(error);
		}
	};

	deleteProduct = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		const productID = req.params.id;
		if (!productID) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Product ID is required' });
		}

		try {
			const { user } = req as any;
			await this.productService.deleteProductByID(productID, user.uid);
			return res.status(StatusCodes.NO_CONTENT).send();
		} catch (error) {
			return next(error);
		}
	};

	updateProduct = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		const productID = req.params.id;
		if (!productID) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Product ID is required' });
		}

		const { user } = req as any;
		const updateProductDto = plainToInstance(UpdateProductDto, req.body);
		const errors = await validate(updateProductDto);
		if (errors.length > 0) {
			const errorMessages = errors.map((e) =>
				Object.values(e.constraints || {}).join(', '),
			);

			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Validation failed', errors: errorMessages });
		}

		try {
			const product = await this.productService.updateProduct(
				productID,
				updateProductDto,
				user.uid,
			);
			return res.status(StatusCodes.OK).json({
				message: 'Product updated successfully',
				product,
			});
		} catch (error) {
			return next(error);
		}
	};
}
