"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const textslider_1 = __importDefault(require("../controllers/textslider"));
const verifyJWT_1 = require("../middlewares/verifyJWT");
const textsliderRouter = (0, express_1.Router)();
const textsliderController = new textslider_1.default();
textsliderRouter.get('/', textsliderController.getAll);
textsliderRouter.get('/:id', textsliderController.get);
textsliderRouter.use(verifyJWT_1.verifyJWT);
textsliderRouter.post('/', textsliderController.create);
textsliderRouter.put('/:id', textsliderController.update);
textsliderRouter.delete('/:id', textsliderController.delete);
exports.default = textsliderRouter;
