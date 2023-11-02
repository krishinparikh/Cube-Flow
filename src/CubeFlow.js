/**
 * Timer logic
 */

// Variables from firebase.js
import { app, db, auth, provider } from './firebase';

// Functions from firebase.js
import { getFirestore, doc, setDoc, collection, getDoc, getDocs, addDoc, query, orderBy, limit, where, serverTimestamp, getAuth, signInWithPopup, GoogleAuthProvider, signInWithRedirect, signOut } from './firebase';

// Variables from index.js
import { signedInUser } from './index'

export let body = document.body;
export let signedIn = false;
export let loggedIn = document.getElementById('loggedIn');
export let loggedOut = document.getElementById('loggedOut');
export let accountImg = document.getElementById('accountImg');
export let dropdown = document.getElementById('dropdown');
export let dropdownName = document.getElementById('dropdown-name');
export let dropdownEmail = document.getElementById('dropdown-email');
export let signOutButton = document.getElementById('sign-out');
export let scramble = document.getElementById('scramble');
export let logInButton = document.getElementById('google-button');
export let timer = document.getElementById('timer');
export let best = document.getElementById('best');
export let avg5 = document.getElementById('avg5');
export let avg12 = document.getElementById('avg12');
export let hide = document.getElementsByClassName('hide');
export let viewTimesButton = document.getElementById('view-times');
export let resetButton = document.getElementById('reset');
export let modal = document.getElementById('modal');
export let minutes = 0;
export let seconds = 0;
export let milliseconds = 0;
export let time;
export let running = false;
export let reset = true;
export let active = true;
export const moves = ["F", "F'", "F2", "B", "B'", "B2", "U", "U'", "U2", "D", "D'", "D2", "R", "R'", "R2", "L", "L'", "L2"];
export let table = document.getElementById('table');

export function startTimer() {
  if (!running && reset) {
    time = setInterval(updateTimer, 10);
    running = true;
  }
}

/**
 * Stops timer and invokes a bunch of functions to update to the current state
 */
export function stopTimer() {
  if (running) {
    clearInterval(time);
    running = false;
    reset = false;

    for (let i = 0; i < hide.length; i++) {
      hide[i].style.visibility = 'visible';
    }

    addSolve();
    generateScramble();
    generateBestTime();
    generateAvg5();
    generateAvg12();
  }
}

export function generateBestTime() {
  const q = query(collection(db, "users", signedInUser.uid, "solves"), orderBy("time"), limit(1));

  getDocs(q)
  .then((querySnapshot) => {
    best.innerHTML = intToTime(querySnapshot.docs[0].data().time);
  });
}

export function generateAvg5() {
  const q = query(collection(db, "users", signedInUser.uid, "solves"), orderBy("timestamp", "desc"), limit(5));
  let x = 0;

  getDocs(q)
  .then((querySnapshot) => {
    for (let i = 0; i < 5; i++) {
      x = x + querySnapshot.docs[i].data().time;
    }
    avg5.innerHTML = intToTime(x/5);
  });
}

export function generateAvg12() {
  const q = query(collection(db, "users", signedInUser.uid, "solves"), orderBy("timestamp", "desc"), limit(12));
  let x = 0;

  getDocs(q)
  .then((querySnapshot) => {
    for (let i = 0; i < 12; i++) {
      x = x + querySnapshot.docs[i].data().time;
    }
    avg12.innerHTML = intToTime(x/12);
  });
}

/**
 * Converts time string into a 2-decimal integer
 */
export function timeToInt(x) {
  return parseFloat(x.substring(0, 2)) * 60 + parseFloat(x.substring(3, 8));
}

/**
 * Converts 2-decimal integer into a time string
 */
export function intToTime(x) {
  let m = Math.floor(x / 60) < 10 ? '0' + Math.floor(x / 60) : Math.floor(x / 60);
  let s = Math.floor(x % 60) < 10 ? '0' + Math.floor(x % 60) : Math.floor(x % 60);
  let ms = Math.round(x % 1 * 100) < 10 ? '0' + Math.round(x % 1 * 100) : Math.round(x % 1 * 100);

  return m + ':' + s + '.' + ms;
}

export function resetTimer() {
  if (!reset) {
    clearInterval(time);
    minutes = 0;
    seconds = 0;
    milliseconds = 0;
    timer.innerHTML = "00:00.00";
    running = false;
    reset = true;
  }
}

export function updateTimer() {
  milliseconds++;

  if (milliseconds == 100) {
    seconds++;
    milliseconds = 0;
  }

  if (seconds == 60) {
    minutes++;
    seconds = 0;
  }
  
  let m = minutes < 10 ? '0' + minutes : minutes;
  let s = seconds < 10 ? '0' + seconds : seconds;
  let ms = milliseconds < 10 ? '0' + milliseconds : milliseconds;
  
  timer.innerHTML = m + ":" + s + "." + ms;
}

export function generateScramble() {
  let scrambleArray = [];
  let previousMove = "";
  let s = "";
  
  for (let i = 0; i < 20; i++) {
    let currentMove;
    do {
      currentMove = moves[Math.floor(Math.random() * moves.length)];
    } while (areSameSide(previousMove, currentMove) || areOpposites(previousMove, currentMove));

    scrambleArray.push(currentMove);
    previousMove = currentMove;
  }

  for (let i = 0; i < scrambleArray.length; i++) {
    s = s + scrambleArray[i] + " ";
  }

  scramble.innerHTML = s;
}

function areSameSide(previousMove, currentMove) {
  return previousMove[0] === currentMove[0];
}

function areOpposites(previousMove, currentMove) {
  const opposites = { "F": "B", "B": "F", "R": "L", "L": "R", "U": "D", "D": "U" };
  return opposites[previousMove[0]] === currentMove[0];
}

/**
 * After a solve is completed, it is added to the database and then immediately retrieved from the database
 * to be displayed in 'view times'
 */
export async function addSolve() {
  await addDoc(collection(db, "users", signedInUser.uid, "solves"), {
    time: timeToInt(timer.innerHTML),
    timestamp: serverTimestamp(),
    scramble: scramble.innerHTML
  });
  
  const q = query(collection(db, "users", signedInUser.uid, "solves"), orderBy("timestamp", "desc"), limit(1));

  getDocs(q)
  .then((querySnapshot) => {
    let row = table.insertRow(1);
    let timeCell = row.insertCell(0);
    let scrambleCell = row.insertCell(1);
    let timestampCell = row.insertCell(2);
    let xCell = row.insertCell(3);

    timeCell.innerHTML = intToTime(querySnapshot.docs[0].data().time);
    scrambleCell.innerHTML = querySnapshot.docs[0].data().scramble;
    timestampCell.innerHTML = new Date(querySnapshot.docs[0].data().timestamp.toMillis()).toLocaleString();
    xCell.innerHTML = "<b>x</b>";
  });
}

/**
 * Generates existing times on page open or reload
 */
export async function generateTimes() {
  const solvesCollection = await getDocs(query(collection(db, 'users', signedInUser.uid, 'solves'), orderBy("timestamp")));

  solvesCollection.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    let row = table.insertRow(1);
    let timeCell = row.insertCell(0);
    let scrambleCell = row.insertCell(1);
    let timestampCell = row.insertCell(2);
    let xCell = row.insertCell(3);
    
    timeCell.innerHTML = intToTime(doc.data().time);
    scrambleCell.innerHTML = doc.data().scramble;
    timestampCell.innerHTML = new Date(doc.data().timestamp.toMillis()).toLocaleString();
    xCell.innerHTML = "<b>x</b>";
  });

}

export async function login() {
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

export async function logOut() {
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}

export async function getExistingUser() {
  const docSnap = await getDoc(doc(db, "users", signedInUser.uid));

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    console.log(signedInUser.uid + " not found");
    await setDoc(doc(db, "users", signedInUser.uid), {});
  }
}