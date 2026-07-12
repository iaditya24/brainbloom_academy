import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase.js";
import { C, heading, body } from "../theme.js";
import TopBar from "../components/TopBar.jsx";

function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    let id = "";
    if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
    else if (u.searchParams.get("v")) id = u.searchParams.get("v");
    else if (u.pathname.includes("/embed/")) id = u.pathname.split("/embed/")[1];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  } catch {
    return url;
  }
}

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setVideos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  return (
    <div style={{ ...body, backgroundColor: C.bg, minHeight: "100vh" }}>
      <TopBar title="Videos" />
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
        <h1 className="text-3xl font-bold mb-2" style={heading}>Video Lectures</h1>
        <p className="text-sm opacity-65 mb-8">Recorded lessons to rewatch anytime you need a refresher.</p>

        {loading && <p className="text-sm opacity-60">Loading…</p>}
        {!loading && videos.length === 0 && (
          <div className="p-10 rounded-2xl border text-center opacity-60 text-sm" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
            No videos have been added yet. Check back soon!
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-6">
          {videos.map((v) => (
            <div key={v.id} className="rounded-2xl border overflow-hidden bg-white" style={{ borderColor: "#E2E8F0" }}>
              <div className="aspect-video">
                <iframe
                  src={toEmbedUrl(v.youtubeUrl)}
                  title={v.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm">{v.title}</p>
                <p className="text-xs opacity-60 mt-0.5">{[v.subject, v.classLevel].filter(Boolean).join(" · ")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
