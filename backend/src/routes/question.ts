import { Router } from 'express';
import QuestionController from '../controllers/question';

const questionRouter = Router();
const questionController = new QuestionController();


questionRouter.get('/', questionController.getAll);

questionRouter.get('/:id', questionController.get);

questionRouter.post('/', questionController.create);

questionRouter.put('/:id', questionController.update);

questionRouter.delete('/:id', questionController.delete);

export default questionRouter;
