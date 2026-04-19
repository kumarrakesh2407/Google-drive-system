import React from "react";
import "./FileCard.css";

const FileCard = ({ file, onDownload, onDelete }) => {
  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();

    if (ext === "pdf")
      return "https://cdn-icons-png.flaticon.com/512/337/337946.png";
    if (["doc", "docx"].includes(ext))
      return "https://cdn-icons-png.flaticon.com/512/337/337932.png";
    if (["xls", "xlsx"].includes(ext))
      return "https://cdn-icons-png.flaticon.com/512/337/337959.png";
    if (["ppt", "pptx"].includes(ext))
      return "https://cdn-icons-png.flaticon.com/512/337/337948.png";
    if (["jpg", "jpeg", "png", "gif"].includes(ext))
      return "https://cdn-icons-png.flaticon.com/512/337/337940.png";
    if (["mp3", "wav"].includes(ext))
      return "https://cdn-icons-png.flaticon.com/512/337/337953.png";
    if (["txt", "log", "md"].includes(ext))
      return "https://cdn-icons-png.flaticon.com/512/337/337956.png";

    // Default icon
    return "https://cdn-icons-png.flaticon.com/512/337/337947.png";
  };

  return (
    <div
      className="file-card"
      onClick={(e) => {
        if (e.target.classList.contains("delete-btn")) return;
        onDownload(file.id);
      }}
    >
      <img src={getFileIcon(file.name)} alt="file icon" />
      <p className="file-name">{file.name}</p>
      <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
      <button className="delete-btn" onClick={() => onDelete(file.id)}>
        🗑️
      </button>
    </div>
  );
};

export default FileCard;
