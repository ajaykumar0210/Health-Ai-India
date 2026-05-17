/**
 * Firebase Configuration for Health AI India
 * Uses @react-native-firebase v21 modular API (v9-compatible)
 */

import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
  signInWithPhoneNumber,
  signInWithCredential as _signInWithCredential,
  GoogleAuthProvider,
  createUserWithEmailAndPassword as _createEmailUser,
  signInWithEmailAndPassword as _signInEmail,
} from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from '@react-native-firebase/firestore';

const app = getApp();
export const auth = getAuth(app);
const db = getFirestore(app);

// Phone Auth
export async function sendOTP(phoneNumber) {
  return await signInWithPhoneNumber(auth, phoneNumber);
}

// Email Auth helpers (pre-bound to auth instance)
export async function createEmailUser(email, password) {
  return await _createEmailUser(auth, email, password);
}

export async function signInEmail(email, password) {
  return await _signInEmail(auth, email, password);
}

// Google Auth
export { GoogleAuthProvider };
export function signInWithCredential(credential) {
  return _signInWithCredential(auth, credential);
}

// Firestore user profile
export async function saveUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), data, { merge: true });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists ? snap.data() : null;
}

export default auth;
