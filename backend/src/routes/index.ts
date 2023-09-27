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
import productRouter from './product';
import orderRouter from './order';
const router = Router();

router.use('/auth', authRouter); 
router.use('/pricelist', pricelistRouter); 
router.use('/question', questionRouter); 
router.use('/contact', contactRouter); 
router.use('/hotproduct', hotproductRouter); 
router.use('/product', productRouter); 
router.use('/slider', textsliderRouter); 
router.use('/imageslider', imagesliderRouter ); 

router.use('/image', uploadimageRouter); 
router.use('/user', userRouter); 
router.use('/cart', cartRouter); 
router.use('/order', orderRouter); 

export default router;
