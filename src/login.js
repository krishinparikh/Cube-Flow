// Variables from firebase.js
import { app, db, auth, provider } from './firebase';

// Functions from firebase.js
import { getFirestore, doc, setDoc, collection, getDoc, getDocs, addDoc, query, orderBy, limit, where, serverTimestamp, getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from './firebase';

export const loginButton = document.getElementById('login');

export function login() {
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
}

export function hello() {
  console.log(322);
}