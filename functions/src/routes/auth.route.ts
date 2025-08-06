import { Router } from 'express';
import { AuthController } from '../controllers/auth/auth.controller';
import { AuthService } from '../services/auth/auth.service';
import { UserRepository } from '../repositories/user/user.repository';

const AuthRouter = Router();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);
AuthRouter.post('/register', authController.registerUser);
AuthRouter.post('/login', authController.loginUser);
export default AuthRouter;
