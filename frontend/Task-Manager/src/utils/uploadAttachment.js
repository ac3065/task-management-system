import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadAttachment = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(
    API_PATHS.TASKS.UPLOAD_ATTACHMENT,
    formData
  );

  const fileUrl = response.data?.fileUrl || "";
  if (!fileUrl) {
    throw new Error("Upload succeeded but no fileUrl returned");
  }

  return {
    fileUrl,
    fileName: response.data?.fileName || file.name,
  };
};

export default uploadAttachment;
