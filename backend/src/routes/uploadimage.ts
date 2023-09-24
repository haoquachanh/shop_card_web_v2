import { Router } from 'express';
// import uploadCloud from '../middlewares/uploader';
import {uploadImage} from '../middlewares/uploader';

const uploadimageRouter = Router();

uploadimageRouter.post('/', uploadImage ,(req, res) => {res.send(req.file)})

export default uploadimageRouter;
