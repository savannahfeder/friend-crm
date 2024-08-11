// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC60tp-FK-RbsInj6-fwf06A9EmodQU7Tg",
  authDomain: "founder-friend-crm.firebaseapp.com",
  projectId: "founder-friend-crm",
  storageBucket: "founder-friend-crm.appspot.com",
  messagingSenderId: "999952748183",
  appId: "1:999952748183:web:811673b6298fc1c94963d2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app, db };
