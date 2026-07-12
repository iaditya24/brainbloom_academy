import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { ClipboardList, ArrowRight } from "lucide-react";
import { db } from "../firebase.js";
import { C, heading, body } from "../theme.js";
import TopBar from "../components/TopBar.jsx";

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "quizzes"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setQuizzes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  return (
    <div style={{ ...body, backgroundColor: C.bg, minHeight: "100vh" }}>
      <TopBar title="Quizzes" />
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
        <h1 className="text-3xl font-bold mb-2" style={heading}>Quizzes</h1>
        <p className="text-sm opacity-65 mb-8">Test yourself and get an instant score.</p>

        {loading && <p className="text-sm opacity-60">Loading…</p>}
        {!loading && quizzes.length === 0 && (
          <div className="p-10 rounded-2xl border text-center opacity-60 text-sm" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
            No quizzes have been added yet. Check back soon!
          </div>
        )}
        <div className="space-y-3">
          {quizzes.map((q) => (
            <Link
              key={q.id} to={`/quizzes/${q.id}`}
              className="p-5 rounded-2xl border flex items-center justify-between gap-3 hover:shadow-lg transition-shadow bg-white"
              style={{ borderColor: "#E2E8F0" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primary}22, ${C.secondary}22)` }}>
                  <ClipboardList size={18} color={C.primary} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{q.title}</p>
                  <p className="text-xs opacity-60 mt-0.5">
                    {[q.subject, q.classLevel].filter(Boolean).join(" · ")} · {q.questions?.length || 0} questions
                  </p>
                </div>
              </div>
              <ArrowRight size={16} className="opacity-40" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
