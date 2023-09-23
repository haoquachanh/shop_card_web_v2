import { Router } from 'express';
import PriceListController from '../controllers/pricelist';

const pricelistRouter = Router();
const pricelistController = new PriceListController();


pricelistRouter.get('/', pricelistController.getAll);

pricelistRouter.get('/:id', pricelistController.get);

pricelistRouter.post('/', pricelistController.create);

pricelistRouter.put('/:id', pricelistController.update);

pricelistRouter.delete('/:id', pricelistController.delete);

export default pricelistRouter;
