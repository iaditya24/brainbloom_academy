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
  apiKey: "AIzaSyAZBRr6O03aZWhSLLomgOI9RAyZyHbVE78",
  authDomain: "brainbloom-academy-aed23.firebaseapp.com",
  projectId: "brainbloom-academy-aed23",
  storageBucket: "brainbloom-academy-aed23.firebasestorage.app",
  messagingSenderId: "1028103643444",
  appId: "1:1028103643444:web:c625ea42c6d98fe14d561",
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
