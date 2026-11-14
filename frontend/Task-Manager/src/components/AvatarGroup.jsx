import React from "react";
import { defaultProfileImage, resolveAvatarUrl } from "../utils/avatar";

const AvatarGroup = ({ avatars, maxVisible = 3 }) => {
  const resolved = (avatars || []).map((url) => resolveAvatarUrl(url));

  return (
    <div className="flex items-center">
      {resolved.slice(0, maxVisible).map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Avatar ${index}`}
          className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 object-cover"
          onError={(e) => {
            e.currentTarget.src = defaultProfileImage;
          }}
        />
      ))}
      {resolved.length > maxVisible && (
        <div className="w-9 h-9 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3">
          +{resolved.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
