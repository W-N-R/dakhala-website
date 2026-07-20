import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY');

if (!isFirebaseConfigured) {
  console.error("Firebase is not configured. Please check your .env variables.");
}

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const googleProvider = new GoogleAuthProvider();

// Helper to save user profile to Firestore
const saveUserToFirestore = async (user) => {
  if (!db || !user) return;
  try {
    const userRef = doc(db, 'users', user.email.toLowerCase());
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${user.email.split('@')[0]}&background=random`,
      lastLogin: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error("Error saving user to Firestore", error);
  }
};

export const onAuthStateChanged = (authInstance, callback) => {
  if (isFirebaseConfigured && authInstance) {
    return firebaseOnAuthStateChanged(authInstance, async (user) => {
      if (user) {
        await saveUserToFirestore(user);
      }
      callback(user);
    });
  }
  
  // Return a dummy unsubscribe function if not configured
  return () => {};
};

export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase is not configured yet. Please add your credentials to .env.local");
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserToFirestore(result.user);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const registerWithEmail = async (email, password) => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase is not configured yet. Please add your credentials to .env.local");
  }
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserToFirestore(result.user);
    return result.user;
  } catch (error) {
    console.error("Error registering with email", error);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase is not configured yet. Please add your credentials to .env.local");
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await saveUserToFirestore(result.user);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email", error);
    throw error;
  }
};

export const logout = async () => {
  if (!isFirebaseConfigured || !auth) {
    return;
  }
  return firebaseSignOut(auth);
};

export const resetPassword = async (email) => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase is not configured yet. Please add your credentials to .env.local");
  }
  if (!email) {
    throw new Error("Please enter your email address to reset your password.");
  }
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw error;
  }
};

