
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAYiCCFXsvDCLtWQdD2VEWmNOtu3wUTs60",
  authDomain: "nexbuy-90ddf.firebaseapp.com",
  projectId: "nexbuy-90ddf",
  storageBucket: "nexbuy-90ddf.appspot.com",
  messagingSenderId: "175685493071",
  appId: "1:175685493071:web:0a03ed9f1d32908aa2a53a",
  measurementId: "G-5W8HM1Q8D0"
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
  signOut
};
