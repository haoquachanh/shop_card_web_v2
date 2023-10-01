"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const card_controller_1 = __importDefault(require("../controllers/card.controller"));
const cardRouter = (0, express_1.Router)();
const cardController = new card_controller_1.default();
cardRouter.get('/all', cardController.getAllCards);
cardRouter.get('/:id', cardController.getCardById);
cardRouter.post('/', cardController.createCard);
cardRouter.put('/:id', cardController.updateCard);
cardRouter.delete('/:id', cardController.deleteCard);
exports.default = cardRouter;
