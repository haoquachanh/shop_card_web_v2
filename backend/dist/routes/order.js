"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_1 = __importDefault(require("../controllers/order"));
const orderRouter = (0, express_1.Router)();
const orderController = new order_1.default();
orderRouter.get('/', orderController.getAll);
orderRouter.get('/:id', orderController.get);
orderRouter.post('/', orderController.create);
orderRouter.put('/:id', orderController.update);
orderRouter.put('/item/:id', orderController.updateItem);
orderRouter.delete('/:id', orderController.delete);
orderRouter.delete('/item/:id', orderController.deleteItem);
exports.default = orderRouter;
