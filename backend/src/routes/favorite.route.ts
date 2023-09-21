import { Router } from 'express';
import FavoriteController from '../controllers/favorite.controller';

const favoriteRouter = Router();
const favoriteController = new FavoriteController();

favoriteRouter.get('/all', favoriteController.getAllFavorites);

favoriteRouter.get('/:id', favoriteController.getFavoriteById);

favoriteRouter.post('/', favoriteController.createFavorite);

favoriteRouter.put('/:id', favoriteController.updateFavorite);

favoriteRouter.delete('/:id', favoriteController.deleteFavorite);

export default favoriteRouter;
