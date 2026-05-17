/**
 * Firebase Configuration for Health AI India
 * Uses @react-native-firebase — initialized natively via google-services.json
 */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Phone Auth
export async function sendOTP(phoneNumber) {
  const confirmationResult = await auth().signInWithPhoneNumber(phoneNumber);
  return confirmationResult;
}

// Google Auth
export const GoogleAuthProvider = auth.GoogleAuthProvider;
export function signInWithCredential(credential) {
  return auth().signInWithCredential(credential);
}

// Firestore user profile
export async function saveUserProfile(uid, data) {
  await firestore().collection('users').doc(uid).set(data, { merge: true });
}

export async function getUserProfile(uid) {
  const snap = await firestore().collection('users').doc(uid).get();
  return snap.exists ? snap.data() : null;
}

export { auth, firestore };
export default auth;
