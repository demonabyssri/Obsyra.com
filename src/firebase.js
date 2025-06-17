
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
  apiKey: "AIzaSyDz-9rgRK8j7fIe1wnnlfb32zCxv_hsXdE",
  authDomain: "obsyra-17dd4.firebaseapp.com",
  projectId: "obsyra-17dd4",
  storageBucket: "obsyra-17dd4.firebasestorage.app",
  messagingSenderId: "783778716842",
  appId: "1:783778716842:web:29480f6cbf33c9ddef44d3",
  measurementId: "G-SF8M2CFYET"
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
