"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = exports.uploadAvtAvthover = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'Lenticular'
    }
});
const uploadCloud = multer({ storage });
exports.uploadImage = uploadCloud.single('image');
exports.uploadAvtAvthover = uploadCloud.fields([
    { name: 'avt', maxCount: 1 },
    { name: 'avt_hover', maxCount: 1 },
]);
exports.uploadImages = uploadCloud.array('images');
