"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const question_1 = __importDefault(require("../controllers/question"));
const verifyJWT_1 = require("../middlewares/verifyJWT");
const questionRouter = (0, express_1.Router)();
const questionController = new question_1.default();
questionRouter.get('/', questionController.getAll);
questionRouter.get('/:id', questionController.get);
questionRouter.use(verifyJWT_1.verifyJWT);
questionRouter.post('/', questionController.create);
questionRouter.put('/:id', questionController.update);
questionRouter.delete('/:id', questionController.delete);
exports.default = questionRouter;
