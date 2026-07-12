import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, UserPlus, AlertCircle } from "lucide-react";
import { C, heading, body } from "../theme.js";
import { useAuth } from "../context/AuthContext.jsx";
import TopBar from "../components/TopBar.jsx";
import { friendlyError } from "./Login.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signup(name.trim(), email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ ...body, backgroundColor: C.bg, minHeight: "100vh" }}>
      <TopBar title="Sign Up" />
      <div className="max-w-md mx-auto px-5 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={heading}>
            Create your account
          </h1>
          <p className="text-sm opacity-65 mt-2">Get access to notes, video lectures, and quizzes.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-7 rounded-3xl border bg-white space-y-4" style={{ borderColor: "#E2E8F0" }}>
          {error && (
            <div className="flex items-start gap-2 text-sm p-3 rounded-xl" style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}>
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
            </div>
          )}
          <div>
            <label className="text-xs font-semibold opacity-70">Full name</label>
            <div className="flex items-center gap-2 mt-1 px-3 py-2.5 rounded-xl border" style={{ borderColor: "#E2E8F0" }}>
              <User size={16} className="opacity-50" />
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full outline-none text-sm bg-transparent"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold opacity-70">Email</label>
            <div className="flex items-center gap-2 mt-1 px-3 py-2.5 rounded-xl border" style={{ borderColor: "#E2E8F0" }}>
              <Mail size={16} className="opacity-50" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full outline-none text-sm bg-transparent"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold opacity-70">Password</label>
            <div className="flex items-center gap-2 mt-1 px-3 py-2.5 rounded-xl border" style={{ borderColor: "#E2E8F0" }}>
              <Lock size={16} className="opacity-50" />
              <input
                required
                minLength={6}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full outline-none text-sm bg-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3.5 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
          >
            <UserPlus size={15} /> {busy ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm opacity-70 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold" style={{ color: C.primary }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
