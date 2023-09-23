import { Router } from 'express';
import CartController from '../controllers/cart';

const cartRouter = Router();
const cartController = new CartController();


cartRouter.get('/', cartController.getAll);
cartRouter.get('/:id', cartController.get);

cartRouter.post('/', cartController.create);

cartRouter.put('/:id', cartController.update);

cartRouter.delete('/:id', cartController.delete);

export default cartRouter;
