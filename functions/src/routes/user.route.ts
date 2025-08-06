import { Router } from 'express';

import { authMiddleware, authorizeRoles } from '../middlewares/';
import { UserService } from '../services/user/user.service';
import { UserController } from '../controllers/user/user.controller';
import { UserRepository } from '../repositories/user/user.repository';

const UserRouter = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const rolesAllowed = ['admin'];

UserRouter.get(
	'/',
	authMiddleware,
	authorizeRoles(...rolesAllowed),
	userController.getAllUsers,
);

export default UserRouter;
