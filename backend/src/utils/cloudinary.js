// import {v2 as cloudinary} from 'cloudinary';
// import { deleteLocalFiles } from './delete.js';
// import fs from "fs"
// import dotenv from 'dotenv';
// dotenv.config();



// //  // console.log(process.env.CLOUDINARY_API_KEY)
// //  // console.log(process.env.CLOUDINARY_CLOUD_NAME)
// //  // console.log(process.env.CLOUDINARY_API_KEY)
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });


// const uploadOnCloudinary = async (filePath) =>{

//   try{
//     if (!filePath) return null 

//     const response = await cloudinary.uploader
//     .upload(filePath, {
//       resource_type : "auto"
//     })
//     // Optionally delete the local file after successful upload
    
//      // console.log(response)
    
//     fs.unlinkSync(filePatha)
   
    

//   return response
//   } 
//   catch(error){
//     fs.unlinkSync(filePath)
//      // console.log(error)
//     // Delete the local file even if upload fails
//       // console.log("hi")
//     return null
//     }
   
// }


// export default uploadOnCloudinary

// // cloudinary.v2.uploader
// // .upload("sample.jpg",
// //   { width: 2000, height: 1000, crop: "limit" })
// // .then(result=> // console.log(result));



import { v2 as cloudinary } from 'cloudinary';

import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  if (!filePath) return null;

  try {
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
    });

    //  // console.log("Upload response:", response);

    // Delete the uploaded file
      await fs.unlink(filePath)
    return response;
  } catch (error) {
    // console.error("Upload error:", error);
    // Clean up the file on error
      await fs.unlink(filePath);
    return null;
  }
};


/*

 */
const deleteCloudinaryFileById = async (publicId, resourceType = "image") => {
    try {
        if (!publicId) return null;

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true // Optional: clears CDN cache so the old image disappears immediately
        });

        if (result.result === "ok") {
            //  // console.log(`Successfully deleted from Cloudinary: ${publicId}`);
        } else {
            // console.warn(`Cloudinary deletion status: ${result.result} for ID: ${publicId}`);
        }

        return result;
    } catch (error) {
        console.error("Cloudinary Deletion Error:", error.message);
        return null;
    }
};
export {uploadOnCloudinary, deleteCloudinaryFileById};