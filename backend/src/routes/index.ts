import { Router } from 'express';
import userRouter from './user'; 
import authRouter from './auth';
import textsliderRouter from './textslider';
import questionRouter from './question';
import contactRouter from './contact';
const router = Router();

router.use('/auth', authRouter); 
router.use('/user', userRouter); 
router.use('/slider', textsliderRouter); 
router.use('/question', questionRouter); 
router.use('/contact', contactRouter); 

export default router;
