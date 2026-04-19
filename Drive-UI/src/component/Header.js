import React from "react";
import "./Header.css";

function Header({ onSearch }) {
  return (
    <div className="header">
      <h2>Welcome to Drive</h2>
      <input
        type="text"
        placeholder="Search in Drive"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}

export default Header;
