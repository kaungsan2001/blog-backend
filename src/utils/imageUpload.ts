import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import createHttpError from "http-errors";

export const uploadImage = async (
  imageBuffer: Buffer,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "blogs",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(
              createHttpError.InternalServerError("Failed to upload image"),
            );
          }
        },
      )
      .end(imageBuffer);
  });
};
