import { Router } from 'express';
import ContactController from '../controllers/contact';

const contactRouter = Router();
const contactController = new ContactController();


contactRouter.get('/all', contactController.getAll);

contactRouter.get('/:id', contactController.get);

contactRouter.post('/', contactController.create);

contactRouter.put('/:id', contactController.update);

contactRouter.delete('/:id', contactController.delete);

export default contactRouter;
