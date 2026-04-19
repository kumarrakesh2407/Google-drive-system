import React, { useState, useEffect } from "react";
import Sidebar from "../src/component/Sidebar";
import Header from "../src/component/Header";
import FileCard from "../src/component/FileCard";
import "./DriveApp.css";
import axios from "axios";

function DriveApp() {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const res = await axios.get("http://localhost:8080/api/files/list");
    setFiles(res.data);
  };

  const handleUploadFromSidebar = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    await axios.post("http://localhost:8080/api/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    fetchFiles();
  };

  const handleDownload = (id) => {
    window.location.href = `http://localhost:8080/api/files/download/${id}`;
  };

  const handleDelete = async (id, fileName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${fileName}"?`
    );
    if (!confirmed) return;

    await axios.delete(`http://localhost:8080/api/files/delete/${id}`);
    fetchFiles();
  };

  // Filter files based on search term
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-layout">
      <Sidebar onFileSelect={handleUploadFromSidebar} />
      <div className="content-area">
        <Header onSearch={setSearchTerm} />

        {filteredFiles.length === 0 ? (
          <div className="empty-state">
            <img src="/default.svg" alt="No Files" style={{ width: "500px" }} />
            <p>
              Drag your files and folders here or use the “New” button to upload
            </p>
          </div>
        ) : (
          <div className="files-grid">
            {filteredFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDownload={handleDownload}
                onDelete={() => handleDelete(file.id, file.name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DriveApp;
