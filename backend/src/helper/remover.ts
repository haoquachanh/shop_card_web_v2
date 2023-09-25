import { v2 as cloudinary } from 'cloudinary'; 

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME , 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
  });

export default function RemoveImage(url:string){
    const parts:string[] = url.split('/');
    const fileNameWithExtension = parts[parts.length - 1];
    const publicId = fileNameWithExtension.split('.')[0];
    let publicIds:string[]=[];
    publicIds.push(`Lenticular/${publicId}`);
    cloudinary.api
        .delete_resources(publicIds, 
            { type: 'upload', resource_type: 'image' })
        .then();
}
