import axios from "axios";
import { AVATAR_UPLOAD_API } from "#/api";
import type { ImageUploadResponse } from "@/typings";

export async function uploadAvatar(
  base64: string,
  fileName: string
): Promise<ImageUploadResponse | undefined> {
  const API_KEY: string = process.env.EXPO_PUBLIC_API_KEY as string;

  if (!base64 || !fileName) {
    throw new Error("Base64 image data and filename are required.");
  }

  try {
    const formData = new FormData();
    formData.append("key", API_KEY);
    formData.append("image", base64);
    formData.append("name", fileName);

    const response = await axios.post(AVATAR_UPLOAD_API, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = response.data as ImageUploadResponse;

    return data;
  } catch (error: any) {
    console.error("Error uploading avatar:", error.message || error);
  }
}
