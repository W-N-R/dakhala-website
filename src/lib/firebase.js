import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if keys exist in environment
const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY');

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
const realAuth = app ? getAuth(app) : null;

// Export auth (will be a mock placeholder if not configured)
export const auth = realAuth || { name: 'mock-auth-instance' };
export const googleProvider = new GoogleAuthProvider();

// Mock User Database & State in LocalStorage
const getMockUsers = () => {
  const users = localStorage.getItem('dakhala-mock-users');
  const userMap = users ? JSON.parse(users) : {};
  // Always ensure the admin account is seeded
  if (!userMap['wuhs.official@gmail.com']) {
    userMap['wuhs.official@gmail.com'] = {
      email: 'wuhs.official@gmail.com',
      password: 'kite00786',
      displayName: 'WUHS Admin',
      photoURL: 'https://ui-avatars.com/api/?name=WUHS+Admin&background=0D8ABC&color=fff'
    };
    localStorage.setItem('dakhala-mock-users', JSON.stringify(userMap));
  }
  return userMap;
};

// Seed initial users
getMockUsers();

let currentMockUser = null;
try {
  const savedUser = localStorage.getItem('dakhala-mock-current-user');
  if (savedUser) {
    currentMockUser = JSON.parse(savedUser);
  }
} catch (e) {
  console.error("Error reading saved mock user", e);
}

const mockListeners = [];

const notifyMockListeners = () => {
  mockListeners.forEach(callback => callback(currentMockUser));
};

export const onAuthStateChanged = (authInstance, callback) => {
  if (isFirebaseConfigured && realAuth) {
    return firebaseOnAuthStateChanged(realAuth, callback);
  }
  
  mockListeners.push(callback);
  // Immediate trigger with current state
  callback(currentMockUser);
  
  return () => {
    const idx = mockListeners.indexOf(callback);
    if (idx > -1) {
      mockListeners.splice(idx, 1);
    }
  };
};

export const signInWithGoogle = async () => {
  if (isFirebaseConfigured && realAuth) {
    try {
      const result = await signInWithPopup(realAuth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  }

  // Mock Google sign-in
  currentMockUser = {
    uid: 'google-mock-uid-' + Math.random().toString(36).substr(2, 9),
    email: 'google.student@gmail.com',
    displayName: 'Google Mock Student',
    photoURL: 'https://ui-avatars.com/api/?name=Google+Student&background=random'
  };
  localStorage.setItem('dakhala-mock-current-user', JSON.stringify(currentMockUser));
  notifyMockListeners();
  return currentMockUser;
};

export const registerWithEmail = async (email, password) => {
  if (isFirebaseConfigured && realAuth) {
    try {
      const result = await createUserWithEmailAndPassword(realAuth, email, password);
      return result.user;
    } catch (error) {
      console.error("Error registering with email", error);
      throw error;
    }
  }

  // Mock Email registration
  const users = getMockUsers();
  if (users[email.toLowerCase()]) {
    throw new Error("Email already in use.");
  }

  const newUser = {
    email: email.toLowerCase(),
    password: password, // In production we would hash this, but this is a local sandbox fallback
    displayName: email.split('@')[0],
    photoURL: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
  };

  users[email.toLowerCase()] = newUser;
  localStorage.setItem('dakhala-mock-users', JSON.stringify(users));

  currentMockUser = {
    uid: 'mock-uid-' + Math.random().toString(36).substr(2, 9),
    email: newUser.email,
    displayName: newUser.displayName,
    photoURL: newUser.photoURL
  };
  localStorage.setItem('dakhala-mock-current-user', JSON.stringify(currentMockUser));
  notifyMockListeners();
  return currentMockUser;
};

export const loginWithEmail = async (email, password) => {
  if (isFirebaseConfigured && realAuth) {
    try {
      const result = await signInWithEmailAndPassword(realAuth, email, password);
      return result.user;
    } catch (error) {
      console.error("Error signing in with email", error);
      throw error;
    }
  }

  // Mock Email login
  const users = getMockUsers();
  const matchedUser = users[email.toLowerCase()];

  if (!matchedUser || matchedUser.password !== password) {
    throw new Error("Invalid email or password.");
  }

  currentMockUser = {
    uid: 'mock-uid-' + matchedUser.email,
    email: matchedUser.email,
    displayName: matchedUser.displayName,
    photoURL: matchedUser.photoURL
  };
  localStorage.setItem('dakhala-mock-current-user', JSON.stringify(currentMockUser));
  notifyMockListeners();
  return currentMockUser;
};

export const logout = async () => {
  if (isFirebaseConfigured && realAuth) {
    return firebaseSignOut(realAuth);
  }
  
  currentMockUser = null;
  localStorage.removeItem('dakhala-mock-current-user');
  notifyMockListeners();
};
