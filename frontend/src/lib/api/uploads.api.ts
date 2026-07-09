import { apiClient } from "./client";

interface SignedUploadParams {
  timestamp: number;
  folder: string;
  signature: string;
  apiKey: string;
  cloudName: string;
}

/**
 * Signed direct-to-Cloudinary upload: get a signature from our API, then
 * POST the file straight to Cloudinary. The raw file never touches our server.
 */
export async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: "image" | "auto" = "auto"
): Promise<string> {
  const { data: signed } = await apiClient.post<SignedUploadParams>("/uploads/sign", { folder });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signed.apiKey);
  formData.append("timestamp", String(signed.timestamp));
  formData.append("signature", signed.signature);
  formData.append("folder", signed.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");

  const result: { secure_url: string } = await res.json();
  return result.secure_url;
}

export async function uploadImageToCloudinary(file: File, folder = "nexora/avatars"): Promise<string> {
  return uploadToCloudinary(file, folder, "image");
}
