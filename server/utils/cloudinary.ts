import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Reusable helper to upload any file to Cloudinary
 * @param filePath - The temp path from express-fileupload
 * @param folder - Optional folder name to organize your Cloudinary media
 */
export const uploadToCloudinary = async (
  filePath: string,
  folder: string = "clinic_app",
): Promise<string> => {
  try {
    const result: UploadApiResponse = await cloudinary.uploader.upload(
      filePath,
      {
        folder: folder,
        resource_type: "auto", // Automatically detects if it's an image or document
      },
    );

    if (!result.secure_url) {
      throw new Error("Failed to get secure_url from Cloudinary");
    }

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Image upload failed");
  }
};
