import { v2 as cloudinary } from 'cloudinary'; 
import 'dotenv/config'

cloudinary.config({ 
    cloud_name: "djchyv9o9", 
    api_key: "269972865434146", 
    api_secret: "4iMBA0LMPv8GADqgLrFWcVSm2Dw",
    secure: true,
  });

function RemoveImage(url:string){
    const parts = url.split('/');
    const fileNameWithExtension = parts[parts.length - 1];
    const publicId = fileNameWithExtension.split('.')[0];
    let publicIds:string[]=[];
    publicIds.push(`Lenticular/${publicId}`);
    cloudinary.api
        .delete_resources(publicIds, 
            { type: 'upload', resource_type: 'image' })
        .then(console.log);
}

RemoveImage("https://res.cloudinary.com/djchyv9o9/image/upload/v1695583375/Lenticular/lbmymyygmrpypdjurg2u.jpg")