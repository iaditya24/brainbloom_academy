import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { C, heading, body } from "../theme.js";
import { useAuth } from "../context/AuthContext.jsx";
import TopBar from "../components/TopBar.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
      const dest = location.state?.from || "/dashboard";
      navigate(dest, { replace: true });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ ...body, backgroundColor: C.bg, minHeight: "100vh" }}>
      <TopBar title="Login" />
      <div className="max-w-md mx-auto px-5 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={heading}>
            Welcome back
          </h1>
          <p className="text-sm opacity-65 mt-2">Log in to see your notes, videos, and quizzes.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-7 rounded-3xl border bg-white space-y-4" style={{ borderColor: "#E2E8F0" }}>
          {error && (
            <div className="flex items-start gap-2 text-sm p-3 rounded-xl" style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}>
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
            </div>
          )}
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            <LogIn size={15} /> {busy ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm opacity-70 mt-6">
          New here?{" "}
          <Link to="/signup" className="font-semibold" style={{ color: C.primary }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export function friendlyError(err) {
  const code = err?.code || "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
    return "Incorrect email or password. Please try again.";
  }
  if (code.includes("email-already-in-use")) return "An account with this email already exists — try logging in instead.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("invalid-email")) return "That doesn't look like a valid email address.";
  if (code.includes("api-key") || code.includes("configuration-not-found")) {
    return "Firebase isn't configured yet. Add your project's config to src/firebase.js (see SETUP.md).";
  }
  return err?.message || "Something went wrong. Please try again.";
}
