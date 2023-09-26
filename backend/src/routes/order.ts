import { Router } from 'express';
import OrderController from '../controllers/order';

const orderRouter = Router();
const orderController = new OrderController();


orderRouter.get('/', orderController.getAll);
orderRouter.get('/:id', orderController.get);

orderRouter.post('/', orderController.create);

orderRouter.put('/:id', orderController.update);
orderRouter.put('/item/:id', orderController.updateItem);

orderRouter.delete('/:id', orderController.delete);
orderRouter.delete('/item/:id', orderController.deleteItem);

export default orderRouter;
