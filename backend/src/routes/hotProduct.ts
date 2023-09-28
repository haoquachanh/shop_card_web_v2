import { Router } from 'express';
import HotProductController from '../controllers/hotproduct';
import { verifyJWT } from '../middlewares/verifyJWT';

const hotproductRouter = Router();
const hotproductController = new HotProductController();


hotproductRouter.get('/', hotproductController.getAll);

hotproductRouter.get('/:id', hotproductController.get);


hotproductRouter.use(verifyJWT)
hotproductRouter.post('/', hotproductController.create);

hotproductRouter.put('/:id', hotproductController.update);

hotproductRouter.delete('/:id', hotproductController.delete);

export default hotproductRouter;
