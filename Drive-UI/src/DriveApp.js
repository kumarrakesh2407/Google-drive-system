import React, { useState, useEffect } from "react";
import Sidebar from "../src/component/Sidebar";
import Header from "../src/component/Header";
import FileCard from "../src/component/FileCard";
import "./DriveApp.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function DriveApp() {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/files/list`);
      setFiles(res.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      // Set empty array or mock data when backend is not available
      setFiles([]);
    }
  };

  const handleUploadFromSidebar = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(`${API_URL}/api/files/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed. Backend server may not be available.");
    }
  };

  const handleDownload = (id) => {
    window.location.href = `${API_URL}/api/files/download/${id}`;
  };

  const handleDelete = async (id, fileName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${fileName}"?`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/api/files/delete/${id}`);
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Delete failed. Backend server may not be available.");
    }
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
