import { Router } from 'express';
import PriceListController from '../controllers/pricelist';
import { verifyJWT } from '../middlewares/verifyJWT';

const pricelistRouter = Router();
const pricelistController = new PriceListController();


pricelistRouter.get('/', pricelistController.getAll);
pricelistRouter.get('/:id', pricelistController.get);

pricelistRouter.use(verifyJWT)
pricelistRouter.post('/', pricelistController.create);
pricelistRouter.put('/:id', pricelistController.update);
pricelistRouter.delete('/:id', pricelistController.delete);

export default pricelistRouter;
