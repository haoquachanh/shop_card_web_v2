"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = __importDefault(require("../controllers/product"));
const uploader_1 = require("../middlewares/uploader");
const verifyJWT_1 = require("../middlewares/verifyJWT");
const productRouter = (0, express_1.Router)();
const productController = new product_1.default();
productRouter.get('/', productController.getAll);
productRouter.get('/:id', productController.get);
productRouter.use(verifyJWT_1.verifyJWT);
productRouter.post('/', uploader_1.uploadAvtAvthover, productController.create);
productRouter.put('/:id', productController.update);
productRouter.delete('/:id', productController.delete);
exports.default = productRouter;
