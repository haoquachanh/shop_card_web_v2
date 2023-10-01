"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_1 = __importDefault(require("../controllers/contact"));
const verifyJWT_1 = require("../middlewares/verifyJWT");
const contactRouter = (0, express_1.Router)();
const contactController = new contact_1.default();
contactRouter.get('/', contactController.getAll);
contactRouter.get('/:id', contactController.get);
contactRouter.use(verifyJWT_1.verifyJWT);
contactRouter.post('/', contactController.create);
contactRouter.put('/:id', contactController.update);
contactRouter.delete('/:id', contactController.delete);
exports.default = contactRouter;
