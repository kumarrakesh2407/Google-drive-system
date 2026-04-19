import React, { useRef } from "react";
import "./Sidebar.css";

function Sidebar({ onFileSelect }) {
  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file); // Pass file to DriveApp
    }
  };

  return (
    <div className="sidebar">
      <button className="new-btn" onClick={handleClick}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/992/992651.png"
          alt="New"
          width="20"
          style={{ marginRight: "8px" }}
        />
        New
      </button>

      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <ul>
        <li>🏠 Home</li>
        <li>📁 My Drive</li>
        <li>💻 Computers</li>
        <li>👥 Shared with me</li>
        <li>🕒 Recent</li>
        <li>⭐ Starred</li>
        <li>🗑️ Trash</li>
        <li>☁️ Storage</li>
      </ul>
    </div>
  );
}

export default Sidebar;
