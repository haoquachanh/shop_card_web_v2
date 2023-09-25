import { Router } from 'express';
// import uploadCloud from '../middlewares/uploader';
import {uploadAvtAvthover, uploadImage} from '../middlewares/uploader';

const uploadimageRouter = Router();

uploadimageRouter.post('/', uploadAvtAvthover ,(req, res) => {console.log(req.files["avt"])})

export default uploadimageRouter;
