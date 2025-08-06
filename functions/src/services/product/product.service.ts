import { Timestamp } from 'firebase-admin/firestore';

import { CustomError, createLogger } from '../../config';
import { ProductModel } from '../../models/product.model';
import {
	CreateProductDto,
	ResponseProductDto,
	UpdateProductDto,
} from '../../dtos/product';
import { ProductRepository } from '../../repositories/product/product.repository';

const logger = createLogger('services/product');

export class ProductService {
	constructor(private readonly productRepository: ProductRepository) {}

	private async findActiveProductByID(
		productID: string,
	): Promise<ProductModel> {
		const product = await this.productRepository.findByID(productID);
		if (!product || product.deletedAt) {
			throw CustomError.notFound(
				`Product with id "${productID}" not found`,
			);
		}
		return product;
	}

	async createProduct(
		dto: CreateProductDto,
		userID: string,
	): Promise<ResponseProductDto> {
		const existingProduct = await this.productRepository.findByName(
			dto.name,
		);
		if (existingProduct) {
			throw CustomError.conflict(
				`Product with name "${dto.name}" already exists`,
			);
		}

		const data: Omit<ProductModel, 'id'> = {
			...dto,
			createdAt: Timestamp.now(),
			updatedAt: null,
			deletedAt: null,
			createdBy: userID,
			updatedBy: null,
			deletedBy: null,
			imageUrl: dto.imageUrl || '',
		};

		try {
			const newID = await this.productRepository.create(data);
			const model: ProductModel = {
				id: newID,
				...data,
			};

			return ResponseProductDto.fromModel(model);
		} catch (error: any) {
			logger.error(`Error creating product: ${error.message}`);
			throw CustomError.internalServerError(
				'Server error, please try again later.',
			);
		}
	}

	async getAllProducts(): Promise<ResponseProductDto[]> {
		const products = await this.productRepository.findAll();
		return products
			.filter((p) => !p.deletedAt)
			.map(ResponseProductDto.fromModel);
	}

	async findOne(productID: string): Promise<ResponseProductDto> {
		const product = await this.findActiveProductByID(productID);
		return ResponseProductDto.fromModel(product);
	}

	async deleteProductByID(productID: string, userID: string): Promise<void> {
		await this.findActiveProductByID(productID);

		try {
			await this.productRepository.softDelete(productID, userID);
		} catch (error: any) {
			logger.error(`Error deleting product: ${error.message}`);
			throw CustomError.internalServerError(
				'Server error, please try again later.',
			);
		}
	}

	async updateProduct(
		productID: string,
		updateProductDto: UpdateProductDto,
		userID: string,
	): Promise<ResponseProductDto> {
		const product = await this.findActiveProductByID(productID);
		const updatedData = {
			...product,
			...updateProductDto,
			updatedAt: Timestamp.now(),
			updatedBy: userID,
		};

		try {
			await this.productRepository.update(productID, updatedData);
			return ResponseProductDto.fromModel(updatedData);
		} catch (error: any) {
			logger.error(`Error updating product: ${error.message}`);
			throw CustomError.internalServerError(
				'Server error, please try again later.',
			);
		}
	}
}
