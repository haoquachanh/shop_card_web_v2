"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favorite_controller_1 = __importDefault(require("../controllers/favorite.controller"));
const favoriteRouter = (0, express_1.Router)();
const favoriteController = new favorite_controller_1.default();
favoriteRouter.get('/all', favoriteController.getAllFavorites);
favoriteRouter.get('/:id', favoriteController.getFavoriteById);
favoriteRouter.post('/', favoriteController.createFavorite);
favoriteRouter.put('/:id', favoriteController.updateFavorite);
favoriteRouter.delete('/:id', favoriteController.deleteFavorite);
exports.default = favoriteRouter;
