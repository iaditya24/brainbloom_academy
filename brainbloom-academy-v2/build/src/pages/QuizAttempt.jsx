import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { CheckCircle2, XCircle, Award, RotateCcw } from "lucide-react";
import { db } from "../firebase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { C, heading, body } from "../theme.js";
import TopBar from "../components/TopBar.jsx";

export default function QuizAttempt() {
  const { id } = useParams();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "quizzes", id));
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(null));
      }
      setLoading(false);
    })();
  }, [id]);

  function selectAnswer(qi, oi) {
    if (submitted) return;
    setAnswers((a) => a.map((v, idx) => (idx === qi ? oi : v)));
  }

  async function handleSubmit() {
    let s = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) s += 1;
    });
    setScore(s);
    setSubmitted(true);
    setSaving(true);
    try {
      await addDoc(collection(db, "results"), {
        uid: user.uid,
        userName: user.displayName || user.email,
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: s,
        total: quiz.questions.length,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Could not save result:", err);
    } finally {
      setSaving(false);
    }
  }

  function retry() {
    setAnswers(new Array(quiz.questions.length).fill(null));
    setSubmitted(false);
    setScore(0);
  }

  if (loading) {
    return (
      <div style={{ ...body, backgroundColor: C.bg, minHeight: "100vh" }}>
        <TopBar title="Quiz" />
        <p className="text-center text-sm opacity-60 py-16">Loading quiz…</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div style={{ ...body, backgroundColor: C.bg, minHeight: "100vh" }}>
        <TopBar title="Quiz" />
        <div className="text-center py-16">
          <p className="text-sm opacity-60 mb-4">Quiz not found.</p>
          <Link to="/quizzes" className="text-sm font-semibold" style={{ color: C.primary }}>← Back to quizzes</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...body, backgroundColor: C.bg, minHeight: "100vh" }}>
      <TopBar title="Quiz" />
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={heading}>{quiz.title}</h1>
        <p className="text-sm opacity-60 mb-8">{[quiz.subject, quiz.classLevel].filter(Boolean).join(" · ")}</p>

        {submitted ? (
          <div className="p-8 rounded-3xl border text-center bg-white mb-8" style={{ borderColor: "#E2E8F0" }}>
            <Award size={36} color={C.primary} className="mx-auto mb-3" />
            <p className="text-3xl font-bold" style={heading}>{score} / {quiz.questions.length}</p>
            <p className="text-sm opacity-65 mt-1">{saving ? "Saving your result…" : "Result saved to your dashboard."}</p>
            <button
              onClick={retry}
              className="mt-5 px-5 py-2.5 rounded-full text-sm font-semibold border inline-flex items-center gap-2"
              style={{ borderColor: C.primary, color: C.primary }}
            >
              <RotateCcw size={14} /> Retry Quiz
            </button>
          </div>
        ) : null}

        <div className="space-y-5">
          {quiz.questions.map((q, qi) => (
            <div key={qi} className="p-5 rounded-2xl border bg-white" style={{ borderColor: "#E2E8F0" }}>
              <p className="font-semibold text-sm mb-3">{qi + 1}. {q.q}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi;
                  const isCorrect = q.correctIndex === oi;
                  let style = { borderColor: "#E2E8F0" };
                  let icon = null;
                  if (submitted) {
                    if (isCorrect) { style = { borderColor: "#22C55E", backgroundColor: "#F0FDF4" }; icon = <CheckCircle2 size={15} color="#22C55E" />; }
                    else if (isSelected && !isCorrect) { style = { borderColor: "#EF4444", backgroundColor: "#FEF2F2" }; icon = <XCircle size={15} color="#EF4444" />; }
                  } else if (isSelected) {
                    style = { borderColor: C.primary, backgroundColor: `${C.primary}0D` };
                  }
                  return (
                    <button
                      key={oi} type="button" onClick={() => selectAnswer(qi, oi)}
                      className="w-full flex items-center justify-between gap-2 text-left text-sm px-4 py-2.5 rounded-xl border transition-colors"
                      style={style}
                    >
                      {opt} {icon}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={answers.some((a) => a === null)}
            className="w-full mt-6 py-3.5 rounded-full text-white text-sm font-semibold disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}
