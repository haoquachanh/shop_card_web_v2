import { Router } from 'express';
import { uploadImages } from '../middlewares/uploader';
import ImagesController from '../controllers/images';

const managerImgRouter = Router();
const imagescontroller =  new ImagesController()

managerImgRouter.post('/', uploadImages,imagescontroller.uploadImage)
managerImgRouter.get('/',imagescontroller.getAll)

managerImgRouter.post('/:productId', imagescontroller.setProductId)

export default managerImgRouter;
