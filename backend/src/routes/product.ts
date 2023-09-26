import { Router } from 'express';
import ProductController from '../controllers/product';
import { uploadAvtAvthover } from '../middlewares/uploader';
import { verifyJWT } from '../middlewares/verifyJWT';

const productRouter = Router();
const productController = new ProductController();

productRouter.use(verifyJWT)
productRouter.get('/', productController.getAll);

productRouter.get('/:id', productController.get);

productRouter.post('/', uploadAvtAvthover, productController.create);

productRouter.put('/:id', productController.update);

productRouter.delete('/:id', productController.delete);

export default productRouter;
