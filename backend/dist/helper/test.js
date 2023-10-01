"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
require("dotenv/config");
cloudinary_1.v2.config({
    cloud_name: "djchyv9o9",
    api_key: "269972865434146",
    api_secret: "4iMBA0LMPv8GADqgLrFWcVSm2Dw",
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
        .then(console.log);
}
RemoveImage("https://res.cloudinary.com/djchyv9o9/image/upload/v1695583375/Lenticular/lbmymyygmrpypdjurg2u.jpg");
