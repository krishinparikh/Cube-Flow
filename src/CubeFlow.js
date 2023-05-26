/**
 * Timer logic
 */

// Variables from firebase.js
import { app, db } from './firebase';

// Functions from firebase.js
import { getFirestore, doc, setDoc, collection, getDoc, getDocs, addDoc, query, orderBy, limit, where, serverTimestamp, getAuth, signInWithPopup, GoogleAuthProvider, signInWithRedirect } from './firebase';

export let scramble = document.getElementById('scramble');
export let timer = document.getElementById('timer');
export let current = document.getElementById('current');
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

    times.push(timeToInt(timer.innerHTML));

    generateCurrentTime();
    generateBestTime();
  }
}

export function generateCurrentTime() {
  const q = query(collection(db, "solves"), orderBy("timestamp", "desc"), limit(1));

  getDocs(q)
  .then((querySnapshot) => {
    current.innerHTML = intToTime(querySnapshot.docs[0].data().time);
  });
}

export function generateBestTime() {
  const q = query(collection(db, "solves"), orderBy("time"), limit(1));

  getDocs(q)
  .then((querySnapshot) => {
    best.innerHTML = intToTime(querySnapshot.docs[0].data().time);
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
  let s = "";
  
  for (let i = 0; i < 20; i++) {
    scrambleArray.push(moves[Math.floor(Math.random() * 18)]);
  }

  for (let i = 0; i < scrambleArray.length; i++) {
    s = s + scrambleArray[i] + " ";
  }

  scramble.innerHTML = s;
}

/**
 * After a solve is completed, it is added to the database and then immediately retrieved from the database
 * to be displayed in 'view times'
 */
export async function addSolve() {
  await addDoc(collection(db, "solves"), {
    time: timeToInt(timer.innerHTML),
    timestamp: serverTimestamp(),
    scramble: scramble.innerHTML
  });
  
  const q = query(collection(db, "solves"), orderBy("timestamp", "desc"), limit(1));

  getDocs(q)
  .then((querySnapshot) => {
    let row = table.insertRow(1);
    let timeCell = row.insertCell(0);
    let scrambleCell = row.insertCell(1);
    let timestampCell = row.insertCell(2);

    timeCell.innerHTML = intToTime(querySnapshot.docs[0].data().time);
    scrambleCell.innerHTML = querySnapshot.docs[0].data().scramble;
    timestampCell.innerHTML = new Date(querySnapshot.docs[0].data().timestamp.toMillis()).toLocaleString();
  });
}

/**
 * Generates existing times on page open or reload
 */
export function generateTimes() {
  const q = query(collection(db, "solves"), orderBy("timestamp"));

  getDocs(q)
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let row = table.insertRow(1);
      let timeCell = row.insertCell(0);
      let scrambleCell = row.insertCell(1);
      let timestampCell = row.insertCell(2);
      
      timeCell.innerHTML = intToTime(doc.data().time);
      scrambleCell.innerHTML = doc.data().scramble;
      timestampCell.innerHTML = new Date(doc.data().timestamp.toMillis()).toLocaleString();
    });
  })
  .catch((error) => {
    console.log("Error getting documents: ", error);
  });

}