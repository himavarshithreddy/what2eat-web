// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, setDoc, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, httpsCallable } from 'firebase/functions';
import axios from 'axios';

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

// Get Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Get Firebase Functions
const functions = getFunctions(app);

// Export Firestore functions, storage, and the callable function
export { db, addDoc, collection, storage, app,setDoc, doc };


const calculateNutriScore = async (data) => {
  try {
    const response = await axios.post(
      'https://us-central1-what2eat-cb440.cloudfunctions.net/calculateHealthScore', 
      data
    );
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { calculateNutriScore };
