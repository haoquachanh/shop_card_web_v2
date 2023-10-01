"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import uploadCloud from '../middlewares/uploader';
const uploader_1 = require("../middlewares/uploader");
const uploadImages_1 = __importDefault(require("../controllers/uploadImages"));
const uploadimageRouter = (0, express_1.Router)();
uploadimageRouter.post('/:id', uploader_1.uploadImages, uploadImages_1.default);
exports.default = uploadimageRouter;
