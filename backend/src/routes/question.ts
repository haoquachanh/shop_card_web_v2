import { Router } from 'express';
import QuestionController from '../controllers/question';
import { verifyJWT } from '../middlewares/verifyJWT';

const questionRouter = Router();
const questionController = new QuestionController();


questionRouter.get('/', questionController.getAll);

questionRouter.get('/:id', questionController.get);


questionRouter.use(verifyJWT)
questionRouter.post('/', questionController.create);
questionRouter.put('/:id', questionController.update);
questionRouter.delete('/:id', questionController.delete);

export default questionRouter;
