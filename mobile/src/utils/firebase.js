/**
 * Firebase Configuration for Health AI India
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAXU0LZ9z3C9jdDXRNPO1oXxIAG2iuzemQ",
  authDomain: "health-ai-india.firebaseapp.com",
  projectId: "health-ai-india",
  storageBucket: "health-ai-india.firebasestorage.app",
  messagingSenderId: "738075468552",
  appId: "1:738075468552:web:dc7161d37c8050c0b882bd",
  measurementId: "G-0BZ10J7Q12"
};

// Initialize Firebase (avoid re-init on hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with AsyncStorage persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

// Firestore
const db = getFirestore(app);

// Phone Auth — pass the FirebaseRecaptchaVerifierModal ref from the component
export async function sendOTP(phoneNumber, recaptchaVerifierRef) {
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifierRef);
  return confirmationResult;
}

// Google Auth — call signInWithCredential from the component after getting id_token via expo-auth-session
export { GoogleAuthProvider, signInWithCredential };

// Firestore user profile
export async function saveUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), data, { merge: true });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export { auth, db, firebaseConfig };
export default app;
