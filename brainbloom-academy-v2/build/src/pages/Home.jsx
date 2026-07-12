import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu, X, Sun, Moon, BookOpen, GraduationCap, Users, Award, Clock,
  CheckCircle2, Download, Star, MessageCircle, ChevronDown, ArrowUp,
  Phone, Mail, MapPin, Send, Sparkles, Calculator, Atom, FlaskConical,
  Code2, ShieldCheck, PlayCircle, Sigma, NotebookPen, ClipboardList,
  FileText, BarChart3, Quote, LogOut, LayoutDashboard,
} from "lucide-react";
import { C, gradientText, heading, body } from "../theme.js";
import { useAuth } from "../context/AuthContext.jsx";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";

import galleryClassroom from "../assets/gallery/classroom.svg";
import galleryDoubt from "../assets/gallery/doubt-session.svg";
import galleryLab from "../assets/gallery/science-lab.svg";
import galleryCoding from "../assets/gallery/coding-class.svg";
import galleryLibrary from "../assets/gallery/library.svg";
import galleryAward from "../assets/gallery/awards.svg";

const GALLERY_IMAGES = [
  { src: galleryClassroom, alt: "Smart classroom session" },
  { src: galleryDoubt, alt: "One-on-one doubt session" },
  { src: galleryLab, alt: "Science lab exploration" },
  { src: galleryCoding, alt: "Coding & computer science class" },
  { src: galleryLibrary, alt: "Study material & library corner" },
  { src: galleryAward, alt: "Student achievements & awards" },
];

const TEAM = [
  {
    initials: "AS",
    name: "Aditya Singh",
    role: "Founder & Lead Educator",
    tags: ["B.Sc. Computer Science", "Cybersecurity"],
    gradient: [C.primary, C.secondary],
  },
  {
    initials: "PS",
    name: "Pari Soni",
    role: "Co-Founder — Technical",
    tags: ["Technical Lead", "Product & Platform"],
    gradient: [C.accent, C.primary],
  },
  {
    initials: "YS",
    name: "Yuvika Saini",
    role: "Co-Founder — Teacher",
    tags: ["Academic Mentor", "Curriculum"],
    gradient: [C.secondary, C.accent],
  },
];

/* ---------------------------------------------------------------
   DATA
--------------------------------------------------------------- */
const NAV_LINKS = ["Home", "Courses", "About", "Teachers", "Study Material", "Gallery", "Testimonials", "FAQ", "Contact"];

const ABOUT_CARDS = [
  { icon: Sparkles, title: "Quality Education", desc: "Structured, syllabus-aligned lessons built for real understanding." },
  { icon: Award, title: "Affordable Fees", desc: "Premium mentorship priced for every family, no hidden costs." },
  { icon: Sigma, title: "Concept Learning", desc: "We teach the 'why', not just the 'what' — no rote memorization." },
  { icon: Users, title: "Small Batch Size", desc: "Focused groups so every student gets seen and heard." },
  { icon: CheckCircle2, title: "Personal Attention", desc: "One-on-one doubt support built into every course." },
  { icon: ClipboardList, title: "Weekly Tests", desc: "Consistent, low-stakes testing that builds real confidence." },
  { icon: MessageCircle, title: "Doubt Sessions", desc: "Dedicated time, every week, for the questions that matter." },
  { icon: PlayCircle, title: "Smart Classes", desc: "Visual, interactive lessons that make hard topics click." },
];

const COURSES = [
  { level: "Class 1–5", subjects: ["English", "Hindi", "Mathematics", "EVS", "Computer"], duration: "45 min / day", mode: "Offline & Online", icon: BookOpen },
  { level: "Class 6–8", subjects: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Computer"], duration: "60 min / day", mode: "Offline & Online", icon: Calculator },
  { level: "Class 9–10", subjects: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Info. Technology"], duration: "75 min / day", mode: "Offline & Online", icon: Atom },
  { level: "Class 11–12 (PCM)", subjects: ["Physics", "Chemistry", "Mathematics"], duration: "90 min / day", mode: "Offline & Online", icon: FlaskConical, badge: "Flagship" },
];

const FUTURE_COURSES = [
  { name: "Computer Science", icon: Code2 },
  { name: "Python", icon: Code2 },
  { name: "Cybersecurity", icon: ShieldCheck },
  { name: "Artificial Intelligence", icon: Sparkles },
];

const STATS = [
  { label: "Students Mentored", value: 200, suffix: "+" },
  { label: "Success Rate", value: 95, suffix: "%" },
  { label: "Teaching Hours", value: 1000, suffix: "+" },
  { label: "Practice Tests", value: 100, suffix: "+" },
];

const MATERIALS = [
  { name: "NCERT Notes", icon: FileText },
  { name: "PDF Notes", icon: FileText },
  { name: "Worksheets", icon: NotebookPen },
  { name: "Practice Questions", icon: ClipboardList },
  { name: "Assignments", icon: ClipboardList },
  { name: "Mock Tests", icon: BarChart3 },
  { name: "Previous Year Papers", icon: FileText },
  { name: "Revision Notes", icon: NotebookPen },
  { name: "Important Questions", icon: Star },
];

const TESTIMONIALS = [
  { name: "Ritika Sharma", role: "Class 10 Student", quote: "Physics finally makes sense. Aditya sir doesn't just give formulas — he shows where they come from.", rating: 5 },
  { name: "Manoj Gupta", role: "Parent, Class 8", quote: "The weekly tests keep my son consistent. I can actually see the progress reports and know where he stands.", rating: 5 },
  { name: "Ishaan Verma", role: "Class 12 Student (PCM)", quote: "Doubt sessions are a game changer. I used to sit on questions for days — now they're solved the same week.", rating: 5 },
  { name: "Sunita Rao", role: "Parent, Class 5", quote: "Small batches mean my daughter actually gets noticed. She looks forward to class, which says a lot.", rating: 5 },
];

const FAQS = [
  { q: "How do I enroll my child?", a: "Fill out the contact form below or call us directly. We'll schedule a free demo class before you commit to anything." },
  { q: "What is the fee structure?", a: "Fees vary by class level and subject load. Reach out for a personalised quote — we keep it affordable and transparent, no hidden charges." },
  { q: "What are the class timings?", a: "We run morning, evening, and weekend batches to fit around school schedules. Timings are confirmed at enrollment." },
  { q: "Are online classes available?", a: "Yes — every batch is offered both offline and online, with the same materials, tests, and doubt support either way." },
  { q: "Is study material included?", a: "Every enrolled student gets NCERT-based notes, worksheets, mock tests, and previous year papers at no extra cost." },
  { q: "How do doubt sessions work?", a: "Weekly dedicated slots, plus async doubt submission any day — most doubts are resolved within 24 hours." },
];

/* ---------------------------------------------------------------
   SMALL UTILITIES
--------------------------------------------------------------- */
function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Counter({ target, suffix, dark }) {
  const [ref, inView] = useInView(0.5);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1400;
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
      else setVal(target);
    }
    requestAnimationFrame(tick);
  }, [inView, target]);
  return (
    <div ref={ref} className="text-4xl sm:text-5xl font-bold" style={{ ...heading, color: dark ? "#fff" : C.dark }}>
      {val}{suffix}
    </div>
  );
}

/* ---------------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------------- */
export default function Home() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [formSent, setFormSent] = useState(false);
  const [formBusy, setFormBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [announceOpen, setAnnounceOpen] = useState(true);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/");
  }, [logout, navigate]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const scrollTo = useCallback((id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const bgMain = dark ? C.dark : C.bg;
  const textMain = dark ? "#E2E8F0" : C.text;
  const cardBg = dark ? C.darkCard : "#ffffff";
  const cardBorder = dark ? C.darkBorder : "#E2E8F0";

  return (
    <div style={{ ...body, backgroundColor: bgMain, color: textMain, minHeight: "100vh" }} className="transition-colors duration-500">
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0px) rotate(0deg);} 50% { transform: translateY(-18px) rotate(4deg);} }
        @keyframes floatSlow { 0%,100% { transform: translateY(0px);} 50% { transform: translateY(-10px);} }
        @keyframes pulseGlow { 0%,100% { opacity:0.35; } 50% { opacity:0.75; } }
        @keyframes spinSlow { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        @keyframes drift { 0% { transform: translateX(0);} 50% { transform: translateX(16px);} 100% { transform: translateX(0);} }
        @keyframes fadeUp { from { opacity:0; transform: translateY(24px);} to { opacity:1; transform: translateY(0);} }
        .reveal { animation: fadeUp 0.7s ease both; }
        .float-anim { animation: float 6s ease-in-out infinite; }
        .float-anim-slow { animation: floatSlow 5s ease-in-out infinite; }
        .spin-slow { animation: spinSlow 30s linear infinite; }
        .glow { animation: pulseGlow 3.5s ease-in-out infinite; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(${C.primary}, ${C.secondary}); border-radius: 8px; }
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) {
          .float-anim, .float-anim-slow, .spin-slow, .glow, .reveal { animation: none !important; }
        }
      `}</style>

      {/* ANNOUNCEMENT BANNER */}
      {announceOpen && (
        <div className="text-center text-sm py-2 px-4 flex items-center justify-center gap-3" style={{ background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`, color: "#fff" }}>
          <span>🌱 New batches for Class 9–12 starting soon — free demo class available.</span>
          <button onClick={() => setAnnounceOpen(false)} aria-label="Dismiss announcement"><X size={14} /></button>
        </div>
      )}

      {/* NAVBAR */}
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? (dark ? "rgba(15,23,42,0.85)" : "rgba(248,250,252,0.85)") : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${cardBorder}` : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-3.5">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <span className="text-lg font-bold" style={heading}>BrainBloom <span style={gradientText}>Academy</span></span>
          </button>

          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(l.toLowerCase().replace(/\s+/g, "-"))}
                className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
              >
                {l}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => setDark(!dark)} className="w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor: cardBorder }} aria-label="Toggle dark mode">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {user ? (
              <>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className="text-sm font-semibold px-4 py-2 rounded-full border flex items-center gap-1.5"
                  style={{ borderColor: cardBorder }}
                >
                  <LayoutDashboard size={14} /> {isAdmin ? "Admin" : "Dashboard"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold px-4 py-2 rounded-full text-white flex items-center gap-1.5"
                  style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
                >
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold px-4 py-2 rounded-full border" style={{ borderColor: cardBorder }}>Login</Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold px-4 py-2 rounded-full text-white"
                  style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden px-5 pb-5 flex flex-col gap-3" style={{ backgroundColor: bgMain }}>
            {NAV_LINKS.map((l) => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase().replace(/\s+/g, "-"))} className="text-left text-sm font-medium py-1.5">
                {l}
              </button>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <button onClick={() => setDark(!dark)} className="w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor: cardBorder }}>
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              {user ? (
                <>
                  <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex-1 text-center text-sm font-semibold px-4 py-2 rounded-full border" style={{ borderColor: cardBorder }}>
                    {isAdmin ? "Admin" : "Dashboard"}
                  </Link>
                  <button onClick={handleLogout} className="flex-1 text-sm font-semibold px-4 py-2 rounded-full text-white" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex-1 text-center text-sm font-semibold px-4 py-2 rounded-full border" style={{ borderColor: cardBorder }}>Login</Link>
                  <Link to="/signup" className="flex-1 text-center text-sm font-semibold px-4 py-2 rounded-full text-white" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden px-5 sm:px-8 pt-14 pb-24">
        {/* ambient gradient blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl glow" style={{ backgroundColor: C.primary, opacity: 0.25 }} />
        <div className="absolute top-40 -right-24 w-96 h-96 rounded-full blur-3xl glow" style={{ backgroundColor: C.secondary, opacity: 0.2 }} />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center relative">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ backgroundColor: dark ? "rgba(37,99,235,0.15)" : "rgba(37,99,235,0.08)", color: C.primary }}>
              <Sparkles size={13} /> Concept-based learning, Class 1–12
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.08] mb-5" style={heading}>
              Learn Today,<br /><span style={gradientText}>Lead Tomorrow.</span>
            </h1>
            <p className="text-base sm:text-lg opacity-75 max-w-lg mb-8 leading-relaxed">
              BrainBloom Academy pairs every student — from Class 1 foundations to PCM mastery in Class 12 — with concept-first teaching, weekly tests, and a mentor who actually answers your doubts.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <button onClick={() => scrollTo("contact")} className="px-6 py-3.5 rounded-full text-white text-sm font-semibold shadow-lg hover:scale-105 transition-transform" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                Enroll Now
              </button>
              <button onClick={() => scrollTo("courses")} className="px-6 py-3.5 rounded-full text-sm font-semibold border hover:scale-105 transition-transform" style={{ borderColor: cardBorder }}>
                Explore Courses
              </button>
              <button className="px-6 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:scale-105 transition-transform" style={{ color: C.primary }}>
                <PlayCircle size={18} /> Watch Demo
              </button>
            </div>
            <div className="flex items-center gap-6 text-sm opacity-70">
              <div className="flex items-center gap-1.5"><Users size={15} /> 200+ students</div>
              <div className="flex items-center gap-1.5"><Star size={15} /> 95% success rate</div>
            </div>
          </div>

          {/* Signature: blooming neural network */}
          <div className="relative h-[420px] flex items-center justify-center reveal" style={{ animationDelay: "0.15s" }}>
            <svg viewBox="0 0 400 400" className="w-full max-w-md spin-slow" style={{ opacity: 0.9 }}>
              <defs>
                <linearGradient id="bloomLine" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={C.primary} />
                  <stop offset="100%" stopColor={C.secondary} />
                </linearGradient>
              </defs>
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const x = 200 + Math.cos(angle) * 120;
                const y = 200 + Math.sin(angle) * 120;
                return <line key={i} x1="200" y1="200" x2={x} y2={y} stroke="url(#bloomLine)" strokeWidth="1.2" opacity="0.5" />;
              })}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const x = 200 + Math.cos(angle) * 120;
                const y = 200 + Math.sin(angle) * 120;
                return <circle key={i} cx={x} cy={y} r="7" fill={i % 2 === 0 ? C.primary : C.accent} />;
              })}
              <circle cx="200" cy="200" r="34" fill="url(#bloomLine)" />
            </svg>
            {/* floating icons */}
            <div className="absolute top-6 left-4 float-anim"><div className="p-3 rounded-2xl shadow-lg" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}><BookOpen size={22} color={C.primary} /></div></div>
            <div className="absolute bottom-10 left-0 float-anim-slow" style={{ animationDelay: "1s" }}><div className="p-3 rounded-2xl shadow-lg" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}><GraduationCap size={22} color={C.secondary} /></div></div>
            <div className="absolute top-10 right-2 float-anim-slow" style={{ animationDelay: "0.5s" }}><div className="p-3 rounded-2xl shadow-lg" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}><Sigma size={22} color={C.accent} /></div></div>
            <div className="absolute bottom-4 right-6 float-anim"><div className="p-3 rounded-2xl shadow-lg" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}><Atom size={22} color={C.primary} /></div></div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-5 sm:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold mb-2" style={{ color: C.primary }}>WHY BRAINBLOOM</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={heading}>Built around how kids actually learn</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ABOUT_CARDS.map((c, i) => (
              <div key={i} className="p-6 rounded-2xl border hover:-translate-y-1.5 transition-transform duration-300 hover:shadow-xl" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg, ${C.primary}22, ${C.secondary}22)` }}>
                  <c.icon size={20} color={C.primary} />
                </div>
                <h3 className="font-semibold mb-1.5" style={heading}>{c.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="px-5 sm:px-8 py-20" style={{ backgroundColor: dark ? "#0B1220" : "#EEF2FF" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold mb-2" style={{ color: C.secondary }}>COURSES</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={heading}>One academy, every stage</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES.map((course, i) => (
              <div key={i} className="relative p-6 rounded-2xl border backdrop-blur-sm hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl flex flex-col" style={{ backgroundColor: dark ? "rgba(22,33,58,0.7)" : "rgba(255,255,255,0.75)", borderColor: cardBorder }}>
                {course.badge && (
                  <span className="absolute -top-3 right-4 text-xs font-semibold px-2.5 py-1 rounded-full text-white" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>{course.badge}</span>
                )}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.accent})` }}>
                  <course.icon size={22} color="#fff" />
                </div>
                <h3 className="font-bold text-lg mb-3" style={heading}>{course.level}</h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {course.subjects.map((s) => (
                    <span key={s} className="text-xs px-2 py-1 rounded-full opacity-80" style={{ backgroundColor: dark ? "#1E2A47" : "#F1F5F9" }}>{s}</span>
                  ))}
                </div>
                <div className="text-xs opacity-60 flex items-center gap-1.5 mb-1"><Clock size={12} /> {course.duration}</div>
                <div className="text-xs opacity-60 flex items-center gap-1.5 mb-5"><PlayCircle size={12} /> {course.mode}</div>
                <button className="mt-auto text-sm font-semibold py-2.5 rounded-full border w-full hover:text-white transition-colors" style={{ borderColor: C.primary, color: C.primary }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.primary; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                  Learn More
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-2xl border flex flex-wrap items-center gap-4 justify-between" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
            <div>
              <p className="font-semibold" style={heading}>Coming soon</p>
              <p className="text-sm opacity-65">Expanding into future-ready tech subjects.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {FUTURE_COURSES.map((f) => (
                <span key={f.name} className="text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5" style={{ backgroundColor: dark ? "#1E2A47" : "#F1F5F9" }}>
                  <f.icon size={13} color={C.accent} /> {f.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE / STATS */}
      <section className="px-5 sm:px-8 py-20">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold mb-2" style={{ color: C.primary }}>WHY CHOOSE US</p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={heading}>The numbers behind the mentorship</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label} className="p-6 rounded-2xl border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
              <Counter target={s.value} suffix={s.suffix} dark={dark} />
              <p className="text-sm opacity-65 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MENTOR + TEAM */}
      <section id="teachers" className="px-5 sm:px-8 py-20" style={{ backgroundColor: dark ? "#0B1220" : "#EEF2FF" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold mb-2" style={{ color: C.secondary }}>MEET YOUR MENTORS</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={heading}>Taught by people who've been there</h2>
          </div>

          <div className="grid lg:grid-cols-[320px_1fr] gap-10 items-start p-8 rounded-3xl border mb-8" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
            <div className="text-center lg:text-left">
              <div className="w-40 h-40 mx-auto lg:mx-0 rounded-3xl flex items-center justify-center mb-5" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                <span className="text-5xl font-bold text-white" style={heading}>AS</span>
              </div>
              <h3 className="text-xl font-bold" style={heading}>Aditya Singh</h3>
              <p className="text-sm opacity-65 mb-3">Founder & Lead Educator</p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: dark ? "#1E2A47" : "#F1F5F9" }}>B.Sc. Computer Science</span>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: dark ? "#1E2A47" : "#F1F5F9" }}>Cybersecurity</span>
              </div>
            </div>
            <div>
              <p className="leading-relaxed opacity-80 mb-5">
                Aditya founded BrainBloom Academy on a simple belief: students don't struggle because they lack ability — they struggle because most classrooms optimize for memorizing answers instead of understanding ideas. With a background in Computer Science and Cybersecurity, he brings a problem-solving, first-principles approach to every subject he teaches, from Class 5 EVS to Class 12 Physics.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: dark ? "#1E2A47" : "#F8FAFC" }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: C.primary }}>Teaching Philosophy</p>
                  <p className="text-sm opacity-75">Concept-based learning over rote memorization — always.</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: dark ? "#1E2A47" : "#F8FAFC" }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: C.primary }}>Student Focus</p>
                  <p className="text-sm opacity-75">Every batch is tracked with weekly tests and progress reports.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Problem Solving", "Critical Thinking", "Interactive Teaching", "Computer Science", "Cybersecurity"].map((s) => (
                  <span key={s} className="text-xs font-medium px-3 py-1.5 rounded-full border" style={{ borderColor: C.primary, color: C.primary }}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* CO-FOUNDERS */}
          <div className="grid sm:grid-cols-2 gap-6">
            {TEAM.slice(1).map((member) => (
              <div
                key={member.initials}
                className="p-7 rounded-3xl border text-center hover:-translate-y-1.5 transition-transform duration-300"
                style={{ backgroundColor: cardBg, borderColor: cardBorder }}
              >
                <div
                  className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-4"
                  style={{ background: `linear-gradient(135deg, ${member.gradient[0]}, ${member.gradient[1]})` }}
                >
                  <span className="text-3xl font-bold text-white" style={heading}>{member.initials}</span>
                </div>
                <h3 className="text-lg font-bold" style={heading}>{member.name}</h3>
                <p className="text-sm opacity-65 mb-3">{member.role}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.tags.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: dark ? "#1E2A47" : "#F1F5F9" }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDY MATERIAL */}
      <section id="study-material" className="px-5 sm:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold mb-2" style={{ color: C.primary }}>STUDY MATERIAL</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={heading}>Everything you need, ready to download</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MATERIALS.map((m) => (
              <div key={m.name} className="flex items-center justify-between p-5 rounded-2xl border hover:shadow-lg transition-shadow" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primary}22, ${C.accent}22)` }}>
                    <m.icon size={18} color={C.primary} />
                  </div>
                  <span className="text-sm font-medium">{m.name}</span>
                </div>
                <button className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }} aria-label={`Download ${m.name}`}>
                  <Download size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="px-5 sm:px-8 py-20" style={{ backgroundColor: dark ? "#0B1220" : "#EEF2FF" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold mb-2" style={{ color: C.secondary }}>TESTIMONIALS</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-10" style={heading}>Students & parents, in their own words</h2>
          <div className="relative p-8 rounded-3xl border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
            <Quote size={28} color={C.primary} className="mx-auto mb-4 opacity-60" />
            <p className="text-lg leading-relaxed mb-6">{TESTIMONIALS[testimonialIdx].quote}</p>
            <div className="flex justify-center gap-1 mb-3">
              {Array.from({ length: TESTIMONIALS[testimonialIdx].rating }).map((_, i) => (
                <Star key={i} size={16} fill={C.accent} color={C.accent} />
              ))}
            </div>
            <p className="font-semibold" style={heading}>{TESTIMONIALS[testimonialIdx].name}</p>
            <p className="text-sm opacity-60">{TESTIMONIALS[testimonialIdx].role}</p>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                className="h-2 rounded-full transition-all"
                style={{ width: i === testimonialIdx ? 24 : 8, backgroundColor: i === testimonialIdx ? C.primary : cardBorder }}
                aria-label={`Show testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="px-5 sm:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold mb-2" style={{ color: C.primary }}>GALLERY</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={heading}>Life at BrainBloom</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" style={{ gridAutoRows: "140px" }}>
            {GALLERY_IMAGES.map((img, i) => (
              <div
                key={img.alt}
                className="relative rounded-2xl overflow-hidden group cursor-pointer"
                style={{ gridRow: i === 0 || i === 3 ? "span 2" : "span 1", backgroundColor: dark ? "#16213A" : "#EEF2FF" }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(0deg, rgba(15,23,42,0.75), transparent 60%)" }}
                >
                  <span className="text-white text-xs font-semibold">{img.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-5 sm:px-8 py-20" style={{ backgroundColor: dark ? "#0B1220" : "#EEF2FF" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold mb-2" style={{ color: C.secondary }}>FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={heading}>Questions parents ask</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-medium">{f.q}</span>
                  <ChevronDown size={18} style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }} />
                </button>
                <div style={{ maxHeight: openFaq === i ? 200 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
                  <p className="px-5 pb-5 text-sm opacity-70 leading-relaxed">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="px-5 sm:px-8 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: C.primary }}>CONTACT</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={heading}>Let's get your child started</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm"><Phone size={16} color={C.primary} /> +91 98765 43210</div>
              <div className="flex items-center gap-3 text-sm"><Mail size={16} color={C.primary} /> hello@brainbloomacademy.in</div>
              <div className="flex items-center gap-3 text-sm"><MapPin size={16} color={C.primary} /> BrainBloom Academy, Sector 12, Your City</div>
            </div>
            <div className="rounded-2xl border h-52 flex items-center justify-center" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
              <div className="text-center opacity-50">
                <MapPin size={26} className="mx-auto mb-2" />
                <p className="text-sm">Map placeholder</p>
              </div>
            </div>
          </div>

          <div className="p-7 rounded-3xl border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
            {formSent ? (
              <div className="text-center py-10">
                <CheckCircle2 size={40} color={C.primary} className="mx-auto mb-3" />
                <p className="font-semibold" style={heading}>Message sent</p>
                <p className="text-sm opacity-65 mt-1">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setFormError("");
                  setFormBusy(true);
                  const fd = new FormData(e.target);
                  try {
                    await addDoc(collection(db, "messages"), {
                      name: fd.get("name"),
                      email: fd.get("email"),
                      phone: fd.get("phone") || "",
                      message: fd.get("message"),
                      createdAt: serverTimestamp(),
                    });
                    setFormSent(true);
                  } catch (err) {
                    console.error("Failed to send message:", err);
                    setFormError("Couldn't send right now — please try again in a moment, or WhatsApp us directly.");
                  } finally {
                    setFormBusy(false);
                  }
                }}
              >
                {formError && (
                  <p className="text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}>{formError}</p>
                )}
                <input name="name" required placeholder="Full name" className="w-full p-3 rounded-xl border bg-transparent text-sm outline-none" style={{ borderColor: cardBorder }} />
                <input name="email" required type="email" placeholder="Email address" className="w-full p-3 rounded-xl border bg-transparent text-sm outline-none" style={{ borderColor: cardBorder }} />
                <input name="phone" placeholder="Phone number" className="w-full p-3 rounded-xl border bg-transparent text-sm outline-none" style={{ borderColor: cardBorder }} />
                <textarea name="message" required placeholder="Which class / course are you interested in?" rows={4} className="w-full p-3 rounded-xl border bg-transparent text-sm outline-none resize-none" style={{ borderColor: cardBorder }} />
                <button type="submit" disabled={formBusy} className="w-full py-3.5 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                  <Send size={15} /> {formBusy ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-5 sm:px-8 pt-16 pb-8" style={{ backgroundColor: C.dark, color: "#CBD5E1" }}>
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                <Sparkles size={16} color="#fff" />
              </div>
              <span className="font-bold text-white" style={heading}>BrainBloom Academy</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">Concept-based coaching for Class 1–12, led by mentor Aditya Singh.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-3 text-sm">Quick Links</p>
            <ul className="space-y-2 text-sm opacity-70">
              {["Home", "Courses", "About", "Contact"].map((l) => (
                <li key={l}><button onClick={() => scrollTo(l.toLowerCase())}>{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-3 text-sm">Courses</p>
            <ul className="space-y-2 text-sm opacity-70">
              <li>Class 1–5</li><li>Class 6–8</li><li>Class 9–10</li><li>Class 11–12 (PCM)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-3 text-sm">Legal</p>
            <ul className="space-y-2 text-sm opacity-70">
              <li>Privacy Policy</li><li>Terms of Service</li>
            </ul>
            <div className="mt-4">
              <p className="text-xs opacity-60 mb-2">Get study tips & batch updates</p>
              <div className="flex gap-2">
                <input placeholder="Email" className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm bg-white/10 outline-none" />
                <button className="px-3 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>Join</button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 text-xs opacity-50 text-center">
          © {new Date().getFullYear()} BrainBloom Academy. All rights reserved.
        </div>
      </footer>

      {/* FLOATING BUTTONS */}
      <a
        href="https://wa.me/919876543210"
        target="_blank" rel="noreferrer"
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
        style={{ backgroundColor: "#25D366" }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} color="#fff" />
      </a>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-xl text-white hover:scale-110 transition-transform"
          style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
