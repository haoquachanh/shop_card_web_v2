import { Router } from 'express';
import ImageSliderController from '../controllers/imageslider';
import { uploadImage } from '../middlewares/uploader';

const imagesliderRouter = Router();
const imagesliderController = new ImageSliderController();


imagesliderRouter.get('/', imagesliderController.getAll);

imagesliderRouter.get('/:id', imagesliderController.get);

imagesliderRouter.post('/', uploadImage, imagesliderController.create);

imagesliderRouter.put('/:id', imagesliderController.update);

imagesliderRouter.delete('/:id', imagesliderController.delete);

export default imagesliderRouter;
