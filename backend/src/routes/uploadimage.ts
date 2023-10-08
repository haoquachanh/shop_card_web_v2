import { Router } from 'express';
// import uploadCloud from '../middlewares/uploader';
import { uploadImages} from '../middlewares/uploader';
import { dataSource } from '../datasource';
import { Image } from '../entities/Image';
import { Product } from '../entities/Product';
import uploadImage from '../controllers/uploadImages';

const uploadimageRouter = Router();

uploadimageRouter.post('/', uploadImages, uploadImage)

export default uploadimageRouter;
