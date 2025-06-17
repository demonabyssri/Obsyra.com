
import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  getAuth, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  onAuthStateChanged, 
  signOut, 
  deleteUser,
  PhoneAuthProvider, 
  RecaptchaVerifier
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
 apiKey: "AIzaSyAvJAAJdYItG34UbBJgBvERjFr4aCq0emM",
  authDomain: "phantom-deals.firebaseapp.com",
  projectId: "phantom-deals",
  storageBucket: "phantom-deals.firebasestorage.app",
  messagingSenderId: "144102481020",
  appId: "1:144102481020:web:79a4820eeefb728050fdf9",
  measurementId: "G-XTE7DEJ2SE"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { 
  auth, 
  db, 
  storage, 
  app, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  onAuthStateChanged,
  signOut,
  deleteUser,
  PhoneAuthProvider,
  RecaptchaVerifier
};
