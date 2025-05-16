import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// Upload an image
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    fs.unlinkSync(localFilePath); // remove from the local directory after upload
    return null;
  }
};

const uploadVideoOnCloudinary = async (localFilePath, publicId = null) => {
  try {
    if (!localFilePath) return null;

    const options = {
      resource_type: "video",
    };

    if (publicId) {
      options.public_id = publicId;
    }

    const response = await cloudinary.uploader.upload(localFilePath, options);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Cloudinary Video Upload Error:", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error(`Cloudinary Delete Error (${resourceType}):`, error);
    return null;
  }
};


export { uploadOnCloudinary, uploadVideoOnCloudinary , deleteFromCloudinary};
