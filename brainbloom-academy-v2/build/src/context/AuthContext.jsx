import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, ADMIN_EMAIL } from "../firebase.js";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "admin" | "student" | null
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthError("");
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const snap = await getDoc(doc(db, "users", firebaseUser.uid));
          if (snap.exists()) {
            setRole(snap.data().role || "student");
          } else {
            // Safety net: user doc missing (e.g. first-ever login before doc created)
            const assignedRole =
              firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "student";
            await setDoc(doc(db, "users", firebaseUser.uid), {
              email: firebaseUser.email,
              name: firebaseUser.displayName || "",
              role: assignedRole,
              createdAt: serverTimestamp(),
            });
            setRole(assignedRole);
          }
        } catch (err) {
          console.error("Failed to load user role:", err);
          setRole("student");
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signup(name, email, password) {
    setAuthError("");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const assignedRole = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "student";
    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      name,
      role: assignedRole,
      createdAt: serverTimestamp(),
    });
    setRole(assignedRole);
    return cred.user;
  }

  async function login(email, password) {
    setAuthError("");
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  async function logout() {
    await signOut(auth);
  }

  const value = {
    user,
    role,
    isAdmin: role === "admin",
    loading,
    authError,
    setAuthError,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
