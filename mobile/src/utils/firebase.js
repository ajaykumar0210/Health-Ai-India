/**
 * Firebase Configuration for Health AI India
 *
 * Setup Instructions:
 * 1. Go to https://console.firebase.google.com
 * 2. Create project "health-ai-india"
 * 3. Enable Authentication → Sign-in methods:
 *    - Phone (for SMS OTP)
 *    - Email/Password
 *    - Google
 * 4. Replace the placeholder values below with your Firebase config
 * 5. For Google Sign-In, also add SHA-1 fingerprint in Project Settings
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export { auth };
export default app;
