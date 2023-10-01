"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hotproduct_1 = __importDefault(require("../controllers/hotproduct"));
const verifyJWT_1 = require("../middlewares/verifyJWT");
const hotproductRouter = (0, express_1.Router)();
const hotproductController = new hotproduct_1.default();
hotproductRouter.get('/', hotproductController.getAll);
hotproductRouter.get('/:id', hotproductController.get);
hotproductRouter.use(verifyJWT_1.verifyJWT);
hotproductRouter.post('/', hotproductController.create);
hotproductRouter.put('/:id', hotproductController.update);
hotproductRouter.delete('/:id', hotproductController.delete);
exports.default = hotproductRouter;
