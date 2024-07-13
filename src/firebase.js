// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2hSyw9K-Jmrvv_zNhH-R2JVCbm98p6XQ",
  authDomain: "digimentor-355c5.firebaseapp.com",
  projectId: "digimentor-355c5",
  storageBucket: "digimentor-355c5.appspot.com",
  messagingSenderId: "847442900914",
  appId: "1:847442900914:web:c0e7f150eca32d349516ab",
  measurementId: "G-2Z7ZPYMVXZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
