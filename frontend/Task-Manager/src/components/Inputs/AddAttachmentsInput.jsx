import React, { useRef, useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip, LuUpload } from "react-icons/lu";
import uploadAttachment from "../../utils/uploadAttachment";

const normalizeLink = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const isValidLink = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const fileLabel = (url) => {
  try {
    const name = decodeURIComponent(url.split("/").pop() || url);
    return name.length > 48 ? `${name.slice(0, 45)}...` : name;
  } catch {
    return url;
  }
};

const AddAttachmentsInput = ({ attachments = [], setAttachments }) => {
  const fileInputRef = useRef(null);
  const [option, setOption] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const list = Array.isArray(attachments) ? attachments : [];

  const addToList = (url) => {
    if (list.includes(url)) {
      setError("This attachment is already added.");
      return false;
    }
    setAttachments([...list, url]);
    setError("");
    return true;
  };

  const handleAddLink = () => {
    const link = normalizeLink(option);
    if (!link) {
      setError("Paste a link or upload a file.");
      return;
    }
    if (!isValidLink(link)) {
      setError("Enter a valid link, e.g. https://drive.google.com/...");
      return;
    }
    if (addToList(link)) setOption("");
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const { fileUrl } = await uploadAttachment(file);
      addToList(fileUrl);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "File upload failed. Try again.";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteOption = (index) => {
    setAttachments(list.filter((_, idx) => idx !== index));
  };

  return (
    <div>
      {list.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="mt-3 mb-2 flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <LuPaperclip className="shrink-0 text-slate-400" />
            <a
              href={item}
              target="_blank"
              rel="noreferrer"
              className="truncate text-xs text-primary underline"
              title={item}
            >
              {fileLabel(item)}
            </a>
          </div>
          <button
            type="button"
            className="cursor-pointer p-1"
            onClick={() => handleDeleteOption(index)}
            aria-label="Remove attachment"
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.doc,.docx,.xls,.xlsx,.zip,image/*,application/pdf"
        onChange={handleFileChange}
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          className="card-btn text-nowrap"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <LuUpload className="text-lg" />
          {uploading ? "Uploading..." : "Upload File"}
        </button>

        <div className="flex flex-1 items-center gap-3 rounded-md border border-slate-200 bg-white px-3">
          <LuPaperclip className="shrink-0 text-slate-400" />
          <input
            type="url"
            placeholder="Or paste Drive / OneDrive / file URL"
            value={option}
            disabled={uploading}
            onChange={({ target }) => {
              setOption(target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddLink();
              }
            }}
            className="w-full bg-transparent py-2 text-[13px] text-slate-900 outline-none"
          />
        </div>

        <button
          type="button"
          className="card-btn text-nowrap"
          disabled={uploading}
          onClick={handleAddLink}
        >
          <HiMiniPlus className="text-lg" />
          Add Link
        </button>
      </div>

      {error ? (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      ) : (
        <p className="mt-2 text-[11px] text-slate-500">
          Upload a file (PDF/image/doc, max 10MB) or paste an external link.
          Files are stored on the server under /uploads.
        </p>
      )}
    </div>
  );
};

export default AddAttachmentsInput;
