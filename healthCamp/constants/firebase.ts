import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Your Firebase config
  apiKey: "AIzaSyArEvpQsgjftRpzsP0U9CcawgHupdq6VNU",
  authDomain: "healthcamp-486b0.firebaseapp.com",
  projectId: "healthcamp-486b0",
  storageBucket: "healthcamp-486b0.firebasestorage.app",
  messagingSenderId: "609831444363",
  appId: "1:609831444363:android:130cbcacbf8dfcf2a8198e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
