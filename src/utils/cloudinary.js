import {v2  as cloudinary} from 'cloudinary'
import fs from 'fs'
import apiError from './apiError.js';
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || "daqewugdy"
const api_key = process.env.CLOUDINARY_API_KEY || '526967196546828'
const api_secret = process.env.CLOUDINARY_API_SECRET || "FUwKP6pnoW2Nfmc_AZeJ_dubUT0"
cloudinary.config({ 
    cloud_name,
    api_key,
    api_secret
  });

  const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if (!localFilePath) throw new apiError(404,'local file path not found!') ;
         
        // upload file on cloudinary 
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        // console.log(response)
        fs.unlinkSync(localFilePath)
        return response.url
    } catch (error) {
      //remove the locally saved temporary file as the upload operation got failed
      console.log(error);
      fs.unlinkSync(localFilePath)
      return null;
    }
  }

  const deleteFileOnCloudinary = async (publicCloudinaryFileId) => {
    try {
      if(!publicCloudinaryFileId) return null;

      const response = await cloudinary.uploader.destroy(publicCloudinaryFileId,(error,result)=>{
        if(error) return error.message
        return result
      })

      return response

    } catch (error) {
      throw new apiError(error.code,error.message)
    }
  }

  export {uploadOnCloudinary, deleteFileOnCloudinary}