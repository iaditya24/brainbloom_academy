import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { Award, FileText, PlayCircle, ClipboardList } from "lucide-react";
import { db } from "../firebase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { C, heading, body } from "../theme.js";
import TopBar from "../components/TopBar.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "results"), where("uid", "==", user.uid), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setResults(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [user]);

  const avg = results.length
    ? Math.round((results.reduce((sum, r) => sum + r.score / r.total, 0) / results.length) * 100)
    : null;

  return (
    <div style={{ ...body, backgroundColor: C.bg, minHeight: "100vh" }}>
      <TopBar title="Dashboard" />
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
        <h1 className="text-3xl font-bold mb-1" style={heading}>
          Welcome, {user?.displayName || "Student"}
        </h1>
        <p className="text-sm opacity-65 mb-8">Here's your learning activity at a glance.</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <Link to="/notes" className="p-5 rounded-2xl border bg-white flex items-center gap-3 hover:shadow-lg transition-shadow" style={{ borderColor: "#E2E8F0" }}>
            <FileText size={20} color={C.primary} /> <span className="text-sm font-semibold">Notes</span>
          </Link>
          <Link to="/videos" className="p-5 rounded-2xl border bg-white flex items-center gap-3 hover:shadow-lg transition-shadow" style={{ borderColor: "#E2E8F0" }}>
            <PlayCircle size={20} color={C.primary} /> <span className="text-sm font-semibold">Videos</span>
          </Link>
          <Link to="/quizzes" className="p-5 rounded-2xl border bg-white flex items-center gap-3 hover:shadow-lg transition-shadow" style={{ borderColor: "#E2E8F0" }}>
            <ClipboardList size={20} color={C.primary} /> <span className="text-sm font-semibold">Quizzes</span>
          </Link>
        </div>

        <div className="p-6 rounded-2xl border bg-white mb-8" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex items-center gap-3">
            <Award size={22} color={C.primary} />
            <div>
              <p className="text-2xl font-bold" style={heading}>{avg !== null ? `${avg}%` : "—"}</p>
              <p className="text-xs opacity-60">Average quiz score across {results.length} attempt{results.length === 1 ? "" : "s"}</p>
            </div>
          </div>
        </div>

        <h2 className="font-semibold mb-3" style={heading}>Quiz history</h2>
        {loading && <p className="text-sm opacity-60">Loading…</p>}
        {!loading && results.length === 0 && (
          <div className="p-8 rounded-2xl border text-center opacity-60 text-sm bg-white" style={{ borderColor: "#E2E8F0" }}>
            No quiz attempts yet. <Link to="/quizzes" className="underline" style={{ color: C.primary }}>Try one now</Link>.
          </div>
        )}
        <div className="space-y-2">
          {results.map((r) => (
            <div key={r.id} className="p-4 rounded-xl border flex items-center justify-between bg-white" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-sm font-medium">{r.quizTitle}</p>
              <p className="text-sm font-semibold" style={{ color: C.primary }}>{r.score} / {r.total}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
