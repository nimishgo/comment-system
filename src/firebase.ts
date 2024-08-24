// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnOEj3tCUB1d5NW0TAFPHGUXEn2oi-TWA",
  authDomain: "comment-section-4568d.firebaseapp.com",
  projectId: "comment-section-4568d",
  storageBucket: "comment-section-4568d.appspot.com",
  messagingSenderId: "211374641309",
  appId: "1:211374641309:web:858a631a54edc9d8fa8474",
  measurementId: "G-S3X4638CXZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
