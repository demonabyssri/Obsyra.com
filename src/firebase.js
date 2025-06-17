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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_FALLBACK_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app;
let auth;
let db;
let storage;

try {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_FALLBACK_API_KEY") {
    console.error("Firebase API Key no está configurada. Verifica tus variables de entorno (VITE_FIREBASE_API_KEY).");
  }
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Error inicializando Firebase:", error);
  console.error("Configuración de Firebase utilizada:", firebaseConfig);
  
  app = null; 
  auth = { 
    onAuthStateChanged: () => () => {}, 
    currentUser: null,
    app: { options: { apiKey: null } } 
  };
  db = null;
  storage = null;
}


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