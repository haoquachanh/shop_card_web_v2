"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pricelist_1 = __importDefault(require("../controllers/pricelist"));
const verifyJWT_1 = require("../middlewares/verifyJWT");
const pricelistRouter = (0, express_1.Router)();
const pricelistController = new pricelist_1.default();
pricelistRouter.get('/', pricelistController.getAll);
pricelistRouter.get('/:id', pricelistController.get);
pricelistRouter.use(verifyJWT_1.verifyJWT);
pricelistRouter.post('/', pricelistController.create);
pricelistRouter.put('/:id', pricelistController.update);
pricelistRouter.delete('/:id', pricelistController.delete);
exports.default = pricelistRouter;
