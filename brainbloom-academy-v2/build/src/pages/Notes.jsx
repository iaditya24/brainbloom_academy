import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { FileText, ExternalLink } from "lucide-react";
import { db } from "../firebase.js";
import { C, heading, body } from "../theme.js";
import TopBar from "../components/TopBar.jsx";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  return (
    <div style={{ ...body, backgroundColor: C.bg, minHeight: "100vh" }}>
      <TopBar title="Notes" />
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
        <h1 className="text-3xl font-bold mb-2" style={heading}>Study Notes</h1>
        <p className="text-sm opacity-65 mb-8">Notes added by your mentors, organized by subject and class.</p>

        {loading && <p className="text-sm opacity-60">Loading…</p>}
        {!loading && notes.length === 0 && (
          <div className="p-10 rounded-2xl border text-center opacity-60 text-sm" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
            No notes have been added yet. Check back soon!
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          {notes.map((n) => (
            <a
              key={n.id} href={n.link} target="_blank" rel="noreferrer"
              className="p-5 rounded-2xl border flex items-start gap-3 hover:shadow-lg transition-shadow bg-white"
              style={{ borderColor: "#E2E8F0" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${C.primary}22, ${C.accent}22)` }}>
                <FileText size={18} color={C.primary} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{n.title}</p>
                <p className="text-xs opacity-60 mt-0.5">{[n.subject, n.classLevel].filter(Boolean).join(" · ")}</p>
              </div>
              <ExternalLink size={14} className="opacity-40 mt-1" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
