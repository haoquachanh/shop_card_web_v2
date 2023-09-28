import { Router } from 'express';
import ImageSliderController from '../controllers/imageslider';
import { uploadImage } from '../middlewares/uploader';
import { verifyJWT } from '../middlewares/verifyJWT';

const imagesliderRouter = Router();
const imagesliderController = new ImageSliderController();


imagesliderRouter.get('/', imagesliderController.getAll);

imagesliderRouter.get('/:id', imagesliderController.get);



imagesliderRouter.use(verifyJWT)
imagesliderRouter.post('/', uploadImage, imagesliderController.create);

imagesliderRouter.put('/:id', imagesliderController.update);

imagesliderRouter.delete('/:id', imagesliderController.delete);

export default imagesliderRouter;
