import { Router } from 'express';
import UserController from '../controllers/auth.controller';

const authRouter = Router();
const authController = new UserController();

authRouter.post('/login', authController.loginByAccount);
authRouter.post('/changePassword', authController.changePassword)
// authRouter.post('/register', authController.getAllUsers);


export default authRouter;
