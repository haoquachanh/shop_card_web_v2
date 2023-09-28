import { Router } from 'express';
import TextSliderController from '../controllers/textslider';
import { verifyJWT } from '../middlewares/verifyJWT';

const textsliderRouter = Router();
const textsliderController = new TextSliderController();


textsliderRouter.get('/', textsliderController.getAll);

textsliderRouter.get('/:id', textsliderController.get);

textsliderRouter.use(verifyJWT)

textsliderRouter.post('/', textsliderController.create);

textsliderRouter.put('/:id', textsliderController.update);

textsliderRouter.delete('/:id', textsliderController.delete);

export default textsliderRouter;
