// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDoc, getDocs, addDoc, query, orderBy, limit, where, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider, signOut } from 'firebase/auth';

export { getFirestore, doc, setDoc, collection, getDoc, getDocs, addDoc, query, orderBy, limit, where, serverTimestamp, getAuth, signInWithPopup, GoogleAuthProvider, signInWithRedirect, signOut };
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCT3m2fgK76v8O2aIDNuDERgctaFa7jFwU",
  authDomain: "cubeflow-e85ec.firebaseapp.com",
  projectId: "cubeflow-e85ec",
  storageBucket: "cubeflow-e85ec.appspot.com",
  messagingSenderId: "313332769536",
  appId: "1:313332769536:web:c3bbefe99f98d8475b89e5",
  measurementId: "G-LRPCPPTF0K",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();