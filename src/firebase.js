import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDWlgLSt0neY4QAkoPKi8oXH5zsWV8WFG8",
  authDomain: "stdmarksmgnt.firebaseapp.com",
  projectId: "stdmarksmgnt",
  storageBucket: "stdmarksmgnt.firebasestorage.app",
  messagingSenderId: "488433575959",
  appId: "1:488433575959:web:c3575d4289525df85ed452",
  measurementId: "G-33ZXPSBMYT"
};

// Ensure firebase doesn't initialize multiple times during hot-reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
