import { Router } from 'express';

import { authMiddleware, authorizeRoles } from '../middlewares/';
import { ProductService } from '../services/product/product.service';
import { ProductController } from '../controllers/product/product.controller';
import { ProductRepository } from '../repositories/product/product.repository';

const ProductRouter = Router();
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const rolesAllowed = ['admin'];

ProductRouter.get('/', authMiddleware, productController.getAllProducts);
ProductRouter.get('/:id', authMiddleware, productController.getProductByID);
ProductRouter.post(
	'/',
	authMiddleware,
	authorizeRoles(...rolesAllowed),
	productController.createProduct,
);
ProductRouter.put(
	'/:id',
	authMiddleware,
	authorizeRoles(...rolesAllowed),
	productController.updateProduct,
);
ProductRouter.delete(
	'/:id',
	authMiddleware,
	authorizeRoles(...rolesAllowed),
	productController.deleteProduct,
);

export default ProductRouter;
