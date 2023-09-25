import { NextFunction, Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME , 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'Lenticular'
    }
});

const uploadCloud = multer({ storage });

export const uploadImage =  uploadCloud.single('image')
export const uploadAvtAvthover=  uploadCloud.fields([
  { name: 'avt', maxCount: 1 },
  { name: 'avt_hover', maxCount: 1 },
])
export const uploadImages= uploadCloud.array('images')
