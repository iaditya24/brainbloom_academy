import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, LogOut, ArrowLeft } from "lucide-react";
import { C, heading, gradientText } from "../theme.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function TopBar({ title }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: "rgba(248,250,252,0.9)", backdropFilter: "blur(10px)", borderColor: "#E2E8F0" }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 py-3.5">
        <Link to="/" className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
          >
            <Sparkles size={18} color="#fff" />
          </div>
          <span className="text-lg font-bold" style={heading}>
            BrainBloom <span style={gradientText}>Academy</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {title && <span className="hidden sm:inline text-sm font-semibold opacity-60">{title}</span>}
          <Link to="/" className="text-sm font-medium opacity-70 hover:opacity-100 flex items-center gap-1.5">
            <ArrowLeft size={15} /> Home
          </Link>
          {user && (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-sm font-semibold" style={{ color: C.primary }}>
                  Admin
                </Link>
              )}
              {!isAdmin && (
                <Link to="/dashboard" className="text-sm font-medium opacity-70 hover:opacity-100">
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm font-semibold px-3.5 py-1.5 rounded-full border flex items-center gap-1.5"
                style={{ borderColor: "#E2E8F0" }}
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
