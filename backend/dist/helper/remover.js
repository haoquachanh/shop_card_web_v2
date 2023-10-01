"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
});
function RemoveImage(url) {
    const parts = url.split('/');
    const fileNameWithExtension = parts[parts.length - 1];
    const publicId = fileNameWithExtension.split('.')[0];
    let publicIds = [];
    publicIds.push(`Lenticular/${publicId}`);
    cloudinary_1.v2.api
        .delete_resources(publicIds, { type: 'upload', resource_type: 'image' })
        .then();
}
exports.default = RemoveImage;
