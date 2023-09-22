import { Router } from 'express';
import UserController from '../controllers/auth';

const authRouter = Router();
const authController = new UserController();

authRouter.post('/login', authController.loginByAccount);
authRouter.post('/changePassword', authController.changePassword)

export default authRouter;
