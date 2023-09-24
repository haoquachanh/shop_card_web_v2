import { Router } from 'express';
import userRouter from './user'; 
import authRouter from './auth';
import textsliderRouter from './textslider';
import questionRouter from './question';
import contactRouter from './contact';
import pricelistRouter from './pricelists';
import hotproductRouter from './hotProduct';
import cartRouter from './cart';
import imagesliderRouter from './imageslider';
import uploadimageRouter from './uploadimage';
const router = Router();

router.use('/auth', authRouter); 
router.use('/user', userRouter); 
router.use('/slider', textsliderRouter); 
router.use('/question', questionRouter); 
router.use('/contact', contactRouter); 
router.use('/pricelist', pricelistRouter); 
router.use('/hotproduct', hotproductRouter); 
router.use('/imageslider', imagesliderRouter ); 
router.use('/cart', cartRouter); 
router.use('/image', uploadimageRouter); 

export default router;
