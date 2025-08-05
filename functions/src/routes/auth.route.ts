import { Router } from 'express';
import { AuthController } from '../controllers/auth/auth.controller';
import { AuthService } from '../services/auth/auth.service';

const AuthRouter = Router();
const authService = new AuthService();
const authController = new AuthController(authService);
AuthRouter.post('/register', authController.registerUser);
export default AuthRouter;
