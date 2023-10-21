import { Router } from 'express';
import { uploadImages } from '../middlewares/uploader';
import ImagesController from '../controllers/images';

const managerImgRouter = Router();
const imagescontroller =  new ImagesController()

managerImgRouter.post('/', uploadImages,imagescontroller.uploadImage)
managerImgRouter.get('/',imagescontroller.getAll)
managerImgRouter.post('/product/:id', imagescontroller.setProductId)
managerImgRouter.post('/avt_product/:id', imagescontroller.setProductId)
managerImgRouter.post('/avt_hover_product/:id', imagescontroller.setProductId)
managerImgRouter.post('/user/:id', imagescontroller.setProductId)
managerImgRouter.post('/slider', imagescontroller.addToSlider)

export default managerImgRouter;
