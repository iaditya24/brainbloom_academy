import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/* ---------------------------------------------------------------
   FIREBASE CONFIG
   Replace these placeholder values with YOUR project's config.
   Get it from: Firebase Console → Project settings → Your apps → Web app.
   Full step-by-step instructions are in SETUP.md at the project root.
--------------------------------------------------------------- */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

/* ---------------------------------------------------------------
   ADMIN ACCESS
   Only the account signed up with this EXACT email address gets
   access to the /admin panel. Everyone else who signs up becomes
   a normal student account. Change this if you ever need to.
--------------------------------------------------------------- */
export const ADMIN_EMAIL = "adityarajput2734@gmail.com";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
