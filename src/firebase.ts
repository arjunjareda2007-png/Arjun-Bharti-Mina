import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase (Firestore database only)
const app = initializeApp(firebaseConfig);

// Use specified database ID if configured
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const isOwnerEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const metaEnv = (import.meta as any)?.env?.VITE_OWNER_EMAIL;
  const configuredOwner = (metaEnv || '').trim().toLowerCase();
  if (configuredOwner) {
    return email.trim().toLowerCase() === configuredOwner;
  }
  const normalized = email.trim().toLowerCase();
  // Owner emails: Arjun's email, or any arjun email
  return (
    normalized === 'arjunjareda2007@gmail.com' ||
    normalized.startsWith('arjun') ||
    normalized.includes('arjunjareda') ||
    normalized === 'creator@arjunbhartimina.com'
  );
};

export {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
};
