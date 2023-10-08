import { Router } from 'express';
import { uploadImages } from '../middlewares/uploader';
import ImagesController from '../controllers/images';

const uploadimageRouter = Router();
const imagescontroller =  new ImagesController()

uploadimageRouter.post('/', imagescontroller.uploadImage)
uploadimageRouter.get('/',imagescontroller.temp)

export default uploadimageRouter;
