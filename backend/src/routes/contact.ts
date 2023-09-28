import { Router } from 'express';
import ContactController from '../controllers/contact';
import { verifyJWT } from '../middlewares/verifyJWT';

const contactRouter = Router();
const contactController = new ContactController();


contactRouter.get('/', contactController.getAll);

contactRouter.get('/:id', contactController.get);

contactRouter.use(verifyJWT)
contactRouter.post('/', contactController.create);

contactRouter.put('/:id', contactController.update);

contactRouter.delete('/:id', contactController.delete);

export default contactRouter;
