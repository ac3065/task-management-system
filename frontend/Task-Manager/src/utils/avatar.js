import { BASE_URL } from "./apiPaths";
import defaultProfileImage from "../assets/images/default-avatar.svg";

/**
 * Resolve a stored profile image path to a browser-usable URL.
 * If user never uploaded a photo, return the generic avatar (not a personal photo).
 */
export const resolveAvatarUrl = (profileImageUrl) => {
  if (!profileImageUrl || typeof profileImageUrl !== "string") {
    return defaultProfileImage;
  }

  const trimmed = profileImageUrl.trim();
  if (!trimmed) return defaultProfileImage;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `${BASE_URL}${trimmed}`;
  }

  return `${BASE_URL}/uploads/${trimmed}`;
};

export { defaultProfileImage };
