import React, { useState, useEffect } from "react";
import Sidebar from "../src/component/Sidebar";
import Header from "../src/component/Header";
import FileCard from "../src/component/FileCard";
import "./DriveApp.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";
const isProduction = process.env.NODE_ENV === 'production';
const shouldSkipApiCalls = false; // Now we have serverless backend

function DriveApp() {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`/api/files/list`);
      setFiles(res.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      setFiles([]);
    }
  };

  const handleUploadFromSidebar = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(`/api/files/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed. Please try again.");
    }
  };

  const handleDownload = (id) => {
    window.location.href = `/api/files/download/${id}`;
  };

  const handleDelete = async (id, fileName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${fileName}"?`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/files/delete/${id}`);
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Delete failed. Please try again.");
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
