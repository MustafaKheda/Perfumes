import { v2 as cloudinary } from "cloudinary";

export type CloudinaryUploadFolder = "scentora/products" | "scentora/collections";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function assertCloudinaryConfig() {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are not configured");
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
  };
}

export function createUploadSignature(folder: CloudinaryUploadFolder) {
  const config = assertCloudinaryConfig();
  const timestamp = Math.round(Date.now() / 1000);

  const params = {
    folder,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    config.apiSecret,
  );

  return {
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    folder,
    timestamp,
    signature,
  };
}

export { cloudinary };
