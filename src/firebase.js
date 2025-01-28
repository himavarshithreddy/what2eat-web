// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZ3H9llfUWIyb9UUjyOWFc6dKfnrcAX9k",
  authDomain: "what2eat-cb440.firebaseapp.com",
  projectId: "what2eat-cb440",
  storageBucket: "what2eat-cb440.firebasestorage.app",
  messagingSenderId: "745594998609",
  appId: "1:745594998609:web:9897439ca7ce0a4c770d70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

// Export Firestore functions
export { db, addDoc, collection, storage };
