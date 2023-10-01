"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageslider_1 = __importDefault(require("../controllers/imageslider"));
const uploader_1 = require("../middlewares/uploader");
const verifyJWT_1 = require("../middlewares/verifyJWT");
const imagesliderRouter = (0, express_1.Router)();
const imagesliderController = new imageslider_1.default();
imagesliderRouter.get('/', imagesliderController.getAll);
imagesliderRouter.get('/:id', imagesliderController.get);
imagesliderRouter.use(verifyJWT_1.verifyJWT);
imagesliderRouter.post('/', uploader_1.uploadImage, imagesliderController.create);
imagesliderRouter.put('/:id', imagesliderController.update);
imagesliderRouter.delete('/:id', imagesliderController.delete);
exports.default = imagesliderRouter;
