"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_1 = __importDefault(require("../controllers/cart"));
const verifyJWT_1 = require("../middlewares/verifyJWT");
const cartRouter = (0, express_1.Router)();
const cartController = new cart_1.default();
cartRouter.use(verifyJWT_1.verifyJWT);
cartRouter.get('/', cartController.getAll);
cartRouter.get('/:id', cartController.get);
cartRouter.post('/', cartController.create);
cartRouter.put('/:id', cartController.update);
cartRouter.delete('/:id', cartController.delete);
exports.default = cartRouter;
