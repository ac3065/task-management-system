import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  // Must match backend: upload.single("image")
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData
    );

    // Backend returns: { imageUrl: "http://host/uploads/..." }
    const imageUrl =
      response.data?.imageUrl ||
      response.data?.image ||
      response.data?.url ||
      "";

    if (!imageUrl) {
      throw new Error("Upload succeeded but no imageUrl returned");
    }

    return { imageUrl };
  } catch (error) {
    console.error("Error uploading the image:", error);
    throw error;
  }
};

export default uploadImage;
