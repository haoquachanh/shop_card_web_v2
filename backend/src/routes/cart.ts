import { Router } from 'express';
import CartController from '../controllers/cart';
import { verifyJWT } from '../middlewares/verifyJWT';

const cartRouter = Router();
const cartController = new CartController();

cartRouter.use(verifyJWT)
cartRouter.get('/', cartController.getAll);
cartRouter.get('/:id', cartController.get);

cartRouter.post('/', cartController.create);

cartRouter.put('/:id', cartController.update);

cartRouter.delete('/:id', cartController.delete);

export default cartRouter;
