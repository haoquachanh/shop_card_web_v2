import { Router } from 'express';
import TextSliderController from '../controllers/textslider';

const textsliderRouter = Router();
const textsliderController = new TextSliderController();


textsliderRouter.get('/', textsliderController.getAll);

textsliderRouter.get('/:id', textsliderController.get);

textsliderRouter.post('/', textsliderController.create);

textsliderRouter.put('/:id', textsliderController.update);

textsliderRouter.delete('/:id', textsliderController.delete);

export default textsliderRouter;
