import { Router } from 'express';
import UserController from '../controllers/auth';
import passport from '../passport';
import * as jwt from "jsonwebtoken";

const authRouter = Router();
const authController = new UserController();

// authRouter.use(passport.initialize());
// authRouter.use(passport.session());

authRouter.post('/login', authController.loginByAccount);
authRouter.post('/changePassword', authController.changePassword)


authRouter.get('/google', passport.authenticate('google', {scope: ['profile','email'], session: false}) );
authRouter.get('/google/callback', passport.authenticate('google',{session: false}) ,authController.loginByOrtherway)
authRouter.post('/google/token',authController.loginWithGGTOKEN)


export default authRouter;
