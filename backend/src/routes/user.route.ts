import { Router } from 'express';
import UserController from '../controllers/user.controller';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/all', userController.getAllUsers);

userRouter.get('/:id', userController.getUserById);

userRouter.post('/', userController.createUser);

userRouter.put('/:id', userController.updateUser);

userRouter.delete('/:id', userController.deleteUser);

userRouter.get('/favorites/:id', userController.getFavorite)

export default userRouter;
