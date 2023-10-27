import { Router } from 'express';
import CommentController from '../controllers/comment';
import { verifyJWT } from '../middlewares/verifyJWT';

const CommentRouter = Router();
const commentController = new CommentController();


CommentRouter.get('/', commentController.getAll);

CommentRouter.get('/:id', commentController.get);

CommentRouter.use(verifyJWT)
CommentRouter.post('/', commentController.create);

CommentRouter.put('/:id', commentController.update);

CommentRouter.delete('/:id', commentController.delete);

export default CommentRouter;
