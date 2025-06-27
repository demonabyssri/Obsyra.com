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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app;
let authInstance;
let db;
let storage;
let firebaseInitializationError = null;

if (!firebaseConfig.apiKey) {
  firebaseInitializationError = "CRITICAL: Firebase API Key is missing. Ensure VITE_FIREBASE_API_KEY is set in your .env file and Vite is configured to read it.";
  console.error(firebaseInitializationError);
} else if (firebaseConfig.apiKey === "YOUR_FALLBACK_API_KEY") {
  firebaseInitializationError = "CRITICAL: Firebase API Key is set to the fallback placeholder. Please provide a valid API Key in VITE_FIREBASE_API_KEY.";
  console.error(firebaseInitializationError);
}

if (!firebaseInitializationError) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error("Error inicializando Firebase:", error);
    console.error("Configuración de Firebase utilizada:", firebaseConfig);
    firebaseInitializationError = `Error inicializando Firebase: ${error.message}. Verifica tu configuración.`;
    
    app = null; 
    authInstance = null;
    db = null;
    storage = null;
  }
}

if (firebaseInitializationError) {
  authInstance = { 
    onAuthStateChanged: () => () => {}, 
    currentUser: null,
    app: { options: { apiKey: null } },
    signInWithEmailAndPassword: () => Promise.reject(new Error(firebaseInitializationError)),
    createUserWithEmailAndPassword: () => Promise.reject(new Error(firebaseInitializationError)),
    sendPasswordResetEmail: () => Promise.reject(new Error(firebaseInitializationError)),
    updateProfile: () => Promise.reject(new Error(firebaseInitializationError)),
    signOut: () => Promise.reject(new Error(firebaseInitializationError)),
    deleteUser: () => Promise.reject(new Error(firebaseInitializationError)),
  };
}


export { 
  authInstance as auth, 
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
  RecaptchaVerifier,
  firebaseInitializationError
};