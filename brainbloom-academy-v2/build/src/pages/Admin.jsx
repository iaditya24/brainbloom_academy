import React, { useEffect, useState } from "react";
import {
  collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp,
} from "firebase/firestore";
import {
  Inbox, FileText, PlayCircle, ClipboardList, Trash2, Plus, Mail, Phone, ShieldCheck, X,
} from "lucide-react";
import { db } from "../firebase.js";
import { C, heading, body } from "../theme.js";
import TopBar from "../components/TopBar.jsx";

const TABS = [
  { id: "messages", label: "Messages", icon: Inbox },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "videos", label: "Videos", icon: PlayCircle },
  { id: "quizzes", label: "Quizzes", icon: ClipboardList },
];

function useCollection(name, sortField = "createdAt") {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const q = query(collection(db, name), orderBy(sortField, "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(`Failed to load ${name}:`, err);
        setLoading(false);
      }
    );
    return unsub;
  }, [name, sortField]);
  return { items, loading };
}

const cardStyle = { backgroundColor: "#fff", borderColor: "#E2E8F0" };
const inputStyle = "w-full px-3 py-2.5 rounded-xl border text-sm outline-none";

export default function Admin() {
  const [tab, setTab] = useState("messages");

  return (
    <div style={{ ...body, backgroundColor: C.bg, minHeight: "100vh" }}>
      <TopBar title="Admin Panel" />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex items-center gap-2 mb-8">
          <ShieldCheck size={20} color={C.primary} />
          <h1 className="text-2xl sm:text-3xl font-bold" style={heading}>
            Admin Panel
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors"
              style={
                tab === t.id
                  ? { background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color: "#fff", borderColor: "transparent" }
                  : { borderColor: "#E2E8F0", color: C.text }
              }
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "messages" && <MessagesTab />}
        {tab === "notes" && <NotesTab />}
        {tab === "videos" && <VideosTab />}
        {tab === "quizzes" && <QuizzesTab />}
      </div>
    </div>
  );
}

/* ---------------- MESSAGES ---------------- */
function MessagesTab() {
  const { items, loading } = useCollection("messages");

  async function remove(id) {
    if (!confirm("Delete this message?")) return;
    await deleteDoc(doc(db, "messages", id));
  }

  if (loading) return <p className="text-sm opacity-60">Loading messages…</p>;
  if (items.length === 0) return <EmptyState text="No messages yet. Submissions from your homepage contact form will show up here." />;

  return (
    <div className="space-y-4">
      {items.map((m) => (
        <div key={m.id} className="p-5 rounded-2xl border" style={cardStyle}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold" style={heading}>{m.name}</p>
              <div className="flex flex-wrap gap-4 text-xs opacity-60 mt-1">
                <span className="flex items-center gap-1"><Mail size={12} /> {m.email}</span>
                {m.phone && <span className="flex items-center gap-1"><Phone size={12} /> {m.phone}</span>}
              </div>
            </div>
            <button onClick={() => remove(m.id)} className="text-red-500 opacity-70 hover:opacity-100" aria-label="Delete message">
              <Trash2 size={16} />
            </button>
          </div>
          <p className="text-sm opacity-80 mt-3 leading-relaxed">{m.message}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------------- NOTES ---------------- */
function NotesTab() {
  const { items, loading } = useCollection("notes");
  const [form, setForm] = useState({ title: "", subject: "", classLevel: "", link: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!form.title || !form.link) return;
    setBusy(true);
    try {
      await addDoc(collection(db, "notes"), { ...form, createdAt: serverTimestamp() });
      setForm({ title: "", subject: "", classLevel: "", link: "" });
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this note?")) return;
    await deleteDoc(doc(db, "notes", id));
  }

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-6">
      <form onSubmit={submit} className="p-6 rounded-2xl border h-fit space-y-3" style={cardStyle}>
        <p className="font-semibold text-sm mb-1" style={heading}>Add a note</p>
        <input required placeholder="Title" className={inputStyle} style={{ borderColor: "#E2E8F0" }} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Subject (e.g. Mathematics)" className={inputStyle} style={{ borderColor: "#E2E8F0" }} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <input placeholder="Class (e.g. Class 9)" className={inputStyle} style={{ borderColor: "#E2E8F0" }} value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: e.target.value })} />
        <input required placeholder="PDF / Google Drive link" className={inputStyle} style={{ borderColor: "#E2E8F0" }} value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        <button disabled={busy} type="submit" className="w-full py-2.5 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
          <Plus size={15} /> {busy ? "Adding…" : "Add Note"}
        </button>
      </form>

      <div className="space-y-3">
        {loading && <p className="text-sm opacity-60">Loading notes…</p>}
        {!loading && items.length === 0 && <EmptyState text="No notes added yet." />}
        {items.map((n) => (
          <div key={n.id} className="p-4 rounded-2xl border flex items-center justify-between gap-3" style={cardStyle}>
            <div>
              <p className="font-semibold text-sm">{n.title}</p>
              <p className="text-xs opacity-60 mt-0.5">{[n.subject, n.classLevel].filter(Boolean).join(" · ")}</p>
              <a href={n.link} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: C.primary }}>Open link</a>
            </div>
            <button onClick={() => remove(n.id)} className="text-red-500 opacity-70 hover:opacity-100 shrink-0" aria-label="Delete note"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- VIDEOS ---------------- */
function VideosTab() {
  const { items, loading } = useCollection("videos");
  const [form, setForm] = useState({ title: "", subject: "", classLevel: "", youtubeUrl: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!form.title || !form.youtubeUrl) return;
    setBusy(true);
    try {
      await addDoc(collection(db, "videos"), { ...form, createdAt: serverTimestamp() });
      setForm({ title: "", subject: "", classLevel: "", youtubeUrl: "" });
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this video?")) return;
    await deleteDoc(doc(db, "videos", id));
  }

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-6">
      <form onSubmit={submit} className="p-6 rounded-2xl border h-fit space-y-3" style={cardStyle}>
        <p className="font-semibold text-sm mb-1" style={heading}>Add a video lecture</p>
        <input required placeholder="Title" className={inputStyle} style={{ borderColor: "#E2E8F0" }} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Subject" className={inputStyle} style={{ borderColor: "#E2E8F0" }} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <input placeholder="Class (e.g. Class 10)" className={inputStyle} style={{ borderColor: "#E2E8F0" }} value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: e.target.value })} />
        <input required placeholder="YouTube URL" className={inputStyle} style={{ borderColor: "#E2E8F0" }} value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} />
        <button disabled={busy} type="submit" className="w-full py-2.5 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
          <Plus size={15} /> {busy ? "Adding…" : "Add Video"}
        </button>
      </form>

      <div className="space-y-3">
        {loading && <p className="text-sm opacity-60">Loading videos…</p>}
        {!loading && items.length === 0 && <EmptyState text="No videos added yet." />}
        {items.map((v) => (
          <div key={v.id} className="p-4 rounded-2xl border flex items-center justify-between gap-3" style={cardStyle}>
            <div>
              <p className="font-semibold text-sm">{v.title}</p>
              <p className="text-xs opacity-60 mt-0.5">{[v.subject, v.classLevel].filter(Boolean).join(" · ")}</p>
              <a href={v.youtubeUrl} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: C.primary }}>Open video</a>
            </div>
            <button onClick={() => remove(v.id)} className="text-red-500 opacity-70 hover:opacity-100 shrink-0" aria-label="Delete video"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- QUIZZES ---------------- */
function emptyQuestion() {
  return { q: "", options: ["", "", "", ""], correctIndex: 0 };
}

function QuizzesTab() {
  const { items, loading } = useCollection("quizzes");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [busy, setBusy] = useState(false);

  function updateQuestion(i, patch) {
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }
  function updateOption(qi, oi, val) {
    setQuestions((qs) =>
      qs.map((q, idx) => (idx === qi ? { ...q, options: q.options.map((o, oidx) => (oidx === oi ? val : o)) } : q))
    );
  }
  function addQuestion() {
    setQuestions((qs) => [...qs, emptyQuestion()]);
  }
  function removeQuestion(i) {
    setQuestions((qs) => qs.filter((_, idx) => idx !== i));
  }

  async function submit(e) {
    e.preventDefault();
    if (!title || questions.some((q) => !q.q || q.options.some((o) => !o))) {
      alert("Please fill in the quiz title and all questions/options.");
      return;
    }
    setBusy(true);
    try {
      await addDoc(collection(db, "quizzes"), {
        title, subject, classLevel, questions, createdAt: serverTimestamp(),
      });
      setTitle(""); setSubject(""); setClassLevel(""); setQuestions([emptyQuestion()]);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this quiz? Student results for it will remain on record.")) return;
    await deleteDoc(doc(db, "quizzes", id));
  }

  return (
    <div className="grid lg:grid-cols-[420px_1fr] gap-6">
      <form onSubmit={submit} className="p-6 rounded-2xl border h-fit space-y-3" style={cardStyle}>
        <p className="font-semibold text-sm mb-1" style={heading}>Create a quiz</p>
        <input required placeholder="Quiz title" className={inputStyle} style={{ borderColor: "#E2E8F0" }} value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Subject" className={inputStyle} style={{ borderColor: "#E2E8F0" }} value={subject} onChange={(e) => setSubject(e.target.value)} />
          <input placeholder="Class" className={inputStyle} style={{ borderColor: "#E2E8F0" }} value={classLevel} onChange={(e) => setClassLevel(e.target.value)} />
        </div>

        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {questions.map((q, qi) => (
            <div key={qi} className="p-3 rounded-xl border space-y-2" style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" }}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold opacity-60">Question {qi + 1}</p>
                {questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(qi)} className="text-red-500"><X size={14} /></button>
                )}
              </div>
              <input
                required placeholder="Question text" className={inputStyle} style={{ borderColor: "#E2E8F0" }}
                value={q.q} onChange={(e) => updateQuestion(qi, { q: e.target.value })}
              />
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input
                    type="radio" name={`correct-${qi}`} checked={q.correctIndex === oi}
                    onChange={() => updateQuestion(qi, { correctIndex: oi })}
                    aria-label={`Mark option ${oi + 1} correct`}
                  />
                  <input
                    required placeholder={`Option ${oi + 1}`} className={inputStyle} style={{ borderColor: "#E2E8F0" }}
                    value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <button type="button" onClick={addQuestion} className="w-full py-2 rounded-full text-sm font-semibold border flex items-center justify-center gap-2" style={{ borderColor: C.primary, color: C.primary }}>
          <Plus size={14} /> Add Question
        </button>
        <button disabled={busy} type="submit" className="w-full py-2.5 rounded-full text-white text-sm font-semibold" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
          {busy ? "Saving…" : "Save Quiz"}
        </button>
      </form>

      <div className="space-y-3">
        {loading && <p className="text-sm opacity-60">Loading quizzes…</p>}
        {!loading && items.length === 0 && <EmptyState text="No quizzes created yet." />}
        {items.map((qz) => (
          <div key={qz.id} className="p-4 rounded-2xl border flex items-center justify-between gap-3" style={cardStyle}>
            <div>
              <p className="font-semibold text-sm">{qz.title}</p>
              <p className="text-xs opacity-60 mt-0.5">
                {[qz.subject, qz.classLevel].filter(Boolean).join(" · ")} · {qz.questions?.length || 0} questions
              </p>
            </div>
            <button onClick={() => remove(qz.id)} className="text-red-500 opacity-70 hover:opacity-100 shrink-0" aria-label="Delete quiz"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="p-8 rounded-2xl border text-center text-sm opacity-60" style={cardStyle}>
      {text}
    </div>
  );
}
