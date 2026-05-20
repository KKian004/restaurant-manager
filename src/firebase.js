// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBByatiuffOBk43oijVUP84vJPiIXGs1K4",
  authDomain: "yumi-3704b.firebaseapp.com",
  projectId: "yumi-3704b",
  storageBucket: "yumi-3704b.firebasestorage.app",
  messagingSenderId: "904885828638",
  appId: "1:904885828638:web:880672dc7644192ba4820f",
  measurementId: "G-Y28H7J1PQ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };