/*
Entry point JS file for Webpack
Calls functions from other JS files
*/

// Variables from CubeFlow.js
import { onAuthStateChanged, signOut } from 'firebase/auth';

import { body, signedIn, loggedIn, loggedOut, accountImg, signOutButton, scramble, logInButton, timer, current, best, avg5, avg12, hide, viewTimesButton, resetButton, modal, minutes, seconds, milliseconds, time, running, reset, active, moves, table, dropdown } from './CubeFlow';

// Functions from CubeFlow.js
import { startTimer, stopTimer, generateCurrentTime, generateBestTime, timeToInt, intToTime, resetTimer, updateTimer, generateScramble, addSolve, generateTimes, login, logOut, getExistingUser } from './CubeFlow';

// Variables from firebase.js
import { app, db, auth, provider } from './firebase';

// Functions from firebase.js
import { getFirestore, doc, setDoc, collection, getDoc, getDocs, addDoc, query, orderBy, limit, where, serverTimestamp, getAuth, signInWithPopup, GoogleAuthProvider, signInWithRedirect } from './firebase';

/*
CubeFlow functions
*/

accountImg.addEventListener('click', () => {
  if (dropdown.style.display === "none" || dropdown.style.display === "") {
    dropdown.style.display = "block";
    active = false;
  } else {
    dropdown.style.display = "none";
    active = true;
  }
});

resetButton.addEventListener('click', resetTimer);

viewTimesButton.addEventListener('click', function() {
  modal.style.display = "block";
  active = false;
});

window.addEventListener('click', function(e) {
  if (e.target == modal) {
    modal.style.display = "none";
    active = true;
  }
});

document.addEventListener('keyup', function(e) {
  if (active) {
    if (e.code === 'Space') {
      e.preventDefault();
      startTimer();
      timer.style.color = 'black';
    }
  }
});

document.addEventListener('keydown', function(e) {
  if (active) {
    e.preventDefault();

    if (running && e.key != 'r') {
      stopTimer();
    }

    if (!running && reset) {
      if (e.code == 'Space') {
        timer.style.color = '#17CD41';

        for (let i = 0; i < hide.length; i++) {
          hide[i].style.visibility = 'hidden';
        }
      }
    }
    
    if (e.key == 'r' && !running) {
      resetTimer();
    }
  }
});

window.addEventListener('load', generateScramble);
window.addEventListener('load', generateCurrentTime);
window.addEventListener('load', generateBestTime);
window.addEventListener('load', generateTimes);

/*
Login functions
*/

signOutButton.addEventListener('click', logOut);
logInButton.addEventListener('click', login);

onAuthStateChanged(auth, (user) => {
  if (user) {
    loggedIn.style.display = 'block';
    loggedOut.style.display = 'none';
    body.style.backgroundColor = 'white';
    dropdown.style.display = 'none';
    getExistingUser(user);
    accountImg.src = user.photoURL;
    generateTimes(user);
  } else {
    loggedIn.style.display = 'none';
    loggedOut.style.display = 'block';
    body.style.backgroundColor = 'rgb(12, 63, 108)';
    accountImg.src = '';
  }
})