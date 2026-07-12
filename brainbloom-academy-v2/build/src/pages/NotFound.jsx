import React from "react";
import { Link } from "react-router-dom";
import { C, heading, body } from "../theme.js";
import TopBar from "../components/TopBar.jsx";

export default function NotFound() {
  return (
    <div style={{ ...body, backgroundColor: C.bg, minHeight: "100vh" }}>
      <TopBar />
      <div className="text-center py-24">
        <h1 className="text-5xl font-bold mb-3" style={heading}>404</h1>
        <p className="text-sm opacity-65 mb-6">This page doesn't exist.</p>
        <Link to="/" className="text-sm font-semibold" style={{ color: C.primary }}>← Back to home</Link>
      </div>
    </div>
  );
}
